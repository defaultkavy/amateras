import type { AnchorTarget } from "#html/$Anchor";
import { _Array_from, _document, _instanceof, _JSON_parse, _JSON_stringify, _Object_entries, _Object_fromEntries, forEach, startsWith } from "#lib/native";
import { Page } from "./Page";
import { BaseRouteNode, Route } from "./Route";

// history index
let index = 0;
const _addEventListener = addEventListener;
const _location = location;
const {origin} = _location;
const _history = history;
const _sessionStorage = sessionStorage;
const documentElement = _document.documentElement;
const [PUSH, REPLACE] = [1, 2] as const;
const [FORWARD, BACK] = ['forward', 'back'] as const;
const scrollStorageKey = '__scroll__';
/** convert path string to URL object */
const toURL = (path: string | URL) => 
    _instanceof(path, URL) ? path : startsWith(path, 'http') ? new URL(path) : new URL(startsWith(path, origin) ? path : origin + path);

type ScrollData = {[key: number]: {x: number, y: number}};
const scrollRecord = (e?: Event) => {
    const data = _JSON_parse(_sessionStorage.getItem(scrollStorageKey) ?? '{}') as ScrollData;
    data[index] = { x: documentElement.scrollLeft, y: documentElement.scrollTop };
    // e is Event when called from scroll or beforeload
    if (!e) forEach(_Object_entries(data), ([i]) => +i > index && delete data[+i])
    _sessionStorage.setItem(scrollStorageKey, _JSON_stringify(data));
}
/** handle history state with push and replace state. */
const historyHandler = async (path: string | URL | Nullish, mode: 1 | 2, target?: AnchorTarget) => {
    if (!path) return;
    const url = toURL(path);
    if (url.href === _location.href) return;
    if (target && target !== '_self') return open(url, target);
    if (url.origin !== origin) return open(url, target);
    scrollRecord();
    if (mode === PUSH) index += 1;
    Router.direction = FORWARD;
    _history[mode === PUSH ? 'pushState' : 'replaceState']({index}, '' , url);
    for (let router of Router.routers) router.routes.size && await router.resolve(path);
}
// disable browser scroll restoration
_history.scrollRestoration = 'manual';

export class Router extends BaseRouteNode<''> {
    static pageRouters = new Map<Page, Router>();
    static routers = new Set<Router>();
    pageMap = new Map<string, Page>();
    static direction: 'back' | 'forward' = FORWARD;
    constructor(page?: Page) {
        super('', () => [], 'router')
        Router.routers.add(this);
        if (page) Router.pageRouters.set(page, this);
    }

    static open(path: string | URL | Nullish, target?: AnchorTarget) {
        historyHandler(path, PUSH, target);
        return this;
    }

    static back() {
        _history.back();
        return this;
    }

    static forward() {
        _history.forward();
        return this;
    }

    static replace(path: string | URL | Nullish) {
        historyHandler(path, REPLACE);
        return this;
    }

    async resolve(path: string | URL) {
        const {pathname, searchParams, hash, href} = toURL(path);
        const routeData = { params: {} as {[key: string]: string}, query: _Object_fromEntries(searchParams) }
        const split = (p: string) => p.replaceAll(/\/+/g, '/').split('/').map(path => `/${path}`);

        function determineRoute(parentRoute: BaseRouteNode<any>, path: string, hash: string | undefined): [route: Route | null, pathId: string][] {
            const targetPathSplit = split(path);
            hash && targetPathSplit.push(hash);
            if (!parentRoute.routes.size) return [];
            routeLoop: for (const route of _Array_from(parentRoute.routes.values()).sort((a, b) => b.path.length - a.path.length)) {
                const routePathSplit = split(route.path);
                let pathId = '';
                splitLoop: for (let i = 0; i < routePathSplit.length; i++) {
                    const pass = () => pathId += targetSnippet;
                    const [routeSnippet, targetSnippet] = [routePathSplit[i], targetPathSplit[i]];
                    if (!routeSnippet || !targetSnippet) continue routeLoop;
                    // process params in path
                    if (routeSnippet.includes(':')) {
                        if (targetSnippet === '/') continue routeLoop;
                        const [prefix, paramName] = routeSnippet.split(':') as [string, string];
                        if (!startsWith(targetSnippet, prefix)) continue routeLoop;
                        routeData.params[paramName] = targetSnippet.replace(`${prefix}`, '');
                        pass();
                        continue splitLoop;
                    }
                    if (routeSnippet === '/' && route.routes.size) continue splitLoop;
                    if (routeSnippet !== targetSnippet) continue routeLoop;
                    pass()
                }
                return [[route, pathId], ...determineRoute(route, path, hash)];
            }
            return [[null, parentRoute.path + '$$NOT_FOUND$$']];
        }
        // analytics
        const targetRoutes = determineRoute(this, pathname + '/', hash);
        // build pages
        let prevPage: null | Page = null, prevRoute: BaseRouteNode<any> = this;
        const appendPage = (prevRouter: Router | undefined, page: Page) => page.parentNode !== prevRouter?.node && prevRouter?.content(page);

        for (const [route, pathId] of targetRoutes) {
            const page = this.pageMap.get(pathId) ?? new Page(route ?? prevRoute.routes.get('404') ?? new Route('404', () => null), routeData);
            if (!page.initial) await route?.build(routeData, page);
            _document && (_document.title = page.pageTitle() ?? _document.title);
            this.pageMap.set(pathId, page);
            if (href === _location.href) appendPage(prevPage ? Router.pageRouters.get(prevPage) : this, page);
            prevPage = page;
            if (route) prevRoute = route;
        }
        let { x, y } = Router.scroll ?? {x: 0, y: 0};
        scrollTo(x, y);
        _document.dispatchEvent(new Event('routeopen', {bubbles: true}));
        return this;
    }

    listen() {
        const resolve = () => {
            const stateIndex = _history.state?.index ?? 0;
            if (index > stateIndex) Router.direction = BACK;
            if (index < stateIndex) Router.direction = FORWARD;
            index = stateIndex;
            this.resolve(_location.href);
        }
        _addEventListener('popstate', resolve);
        _addEventListener('beforeunload', scrollRecord);
        _addEventListener('scroll', scrollRecord, false);
        resolve();
        return this;
    }

    static get scroll(): ScrollData[number] {
        return _JSON_parse(_sessionStorage.getItem(scrollStorageKey) ?? '{}')[index]
    }
}