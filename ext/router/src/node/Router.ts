import { $HTMLElement } from "amateras/node/$HTMLElement";
import { Route, type RouteBuilder, type RoutePath, type RouteParamsResolver, type RouteParams, type RouteParamsStrings, type AsyncPageBuilder } from "../structure/Route";
import { _document } from "amateras/lib/env";
import { _instanceof, startsWith, _JSON_parse, forEach, _Object_entries, _JSON_stringify, _Object_assign, isFunction, _null } from "../../../../src/lib/native";
import type { AnchorTarget } from "../../../html/node/$Anchor";
import { Page, type PageParams } from "./Page";
import type { PageBuilder, PageBuilderFunction } from "#structure/PageBuilder";
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
    Router.prevUrl = toURL(_location.href);
    _history[mode === PUSH ? 'pushState' : 'replaceState']({index}, '' , url);
    Router.url = url;
    forEach(Router.routers, router => router.resolve(path))
}
// disable browser scroll restoration
_history.scrollRestoration = 'manual';

export class Router extends $HTMLElement {
    static direction: 'back' | 'forward' = FORWARD;
    static routers = new Set<Router>();
    static url: URL = toURL(_location.href);
    static prevUrl: URL | null = null;
    routes = new Map<RoutePath, Route>();
    pages = new Map<string, Page>();
    constructor(page?: Page) {
        super('router');
        if (page) page.router = this;
        else Router.routers.add(this);
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

    static get scroll(): ScrollData[number] {
        return _JSON_parse(_sessionStorage.getItem(scrollStorageKey) ?? '{}')[index] ?? {x: 0, y: 0}
    }
    
    listen() {
        const resolve = () => {
            const stateIndex = _history.state?.index ?? 0;
            if (index > stateIndex) Router.direction = BACK;
            if (index < stateIndex) Router.direction = FORWARD;
            index = stateIndex;
            Router.prevUrl = Router.url;
            Router.url = toURL(_location.href);
            this.resolve(_location.href);
        }
        _addEventListener('popstate', resolve);
        _addEventListener('beforeunload', scrollRecord);
        _addEventListener('scroll', scrollRecord, false);
        resolve();
        return this;
    }

    async resolve(path: string | URL): Promise<this> {
        const {pathname, href} = toURL(path);
        const split = (p: string) => p.replaceAll(/\/+/g, '/').replace(/^\//, '').split('/').map(path => `/${path}`);
        type RouteData = { route: Route, params: PageParams, pathId: string }
        const searchRoute = (routes: typeof this.routes, targetPath: string): RouteData[] => {
            let targetPathSplit = split(targetPath);
            if (!routes.size) return [];
            // check each route
            for (const [_, route] of routes) {
                // check each path pass
                routePathLoop: for (const [path, paramsHandle] of route.paths) {
                    let routePathSplit = split(path);
                    let targetPathNodePosition = 0;
                    let params: { [key: string]: string } = isFunction(paramsHandle) ? paramsHandle() : paramsHandle ?? {};
                    let pathId = '';
                    // check each path node
                    pathNodeLoop: for (let i = 0; i < routePathSplit.length; i++) {
                        // reset target path node position
                        targetPathNodePosition = i;
                        const routeNode = routePathSplit[i];
                        const targetNode = targetPathSplit[i];
                        // path node undefined, break path loop
                        if (!routeNode || !targetNode) continue routePathLoop;
                        // path node is params node
                        if (routeNode.includes(':')) {
                            // target not matched
                            if (targetNode === '/') continue routePathLoop;
                            const [prefix, paramName] = routeNode.split(':') as [string, string];
                            if (!startsWith(targetNode, prefix)) continue routePathLoop;
                            params[paramName] = targetNode.replace(`${prefix}`, '');
                            pathId += targetNode;
                            continue pathNodeLoop;
                        }
                        // path node not matched, next path
                        if (routeNode !== targetNode) continue routePathLoop;
                        pathId += targetNode;
                    }
                    // target path node longer than route, next route
                    if (targetPathSplit[targetPathNodePosition + 1] && !route.routes.size) continue routePathLoop;
                    // all path node passed, route found
                    return [{route, params, pathId}, ...searchRoute(route.routes, targetPathSplit.slice(targetPathNodePosition + 1).join('/'))]
                }
            }
            // no route passed
            const notfound = routes.get('notfound');
            if (notfound) return [{route: notfound, params: {}, pathId: 'notfound'}]
            return [];
        }
        const routes = searchRoute(this.routes, pathname);
        let prevRouter: Router | null = this;
        await forEach(routes, async ({route, params, pathId}) => {
            // skip route group
            const builderResolver = route.builder;
            if (!builderResolver) return;
            // get page from cache or create new page
            const page = route.pages.get(pathId) ?? new Page(params);
            // resolve builder
            if (!page.built) await builderResolver.build(page);
            page.built = true;
            // set title
            _document && (_document.title = page.pageTitle() ?? _document.title);
            // check location is still same, page parent is not router before insert page
            if (href === _location.href && page.parentNode !== prevRouter?.node) prevRouter?.content(page);
            // set cache
            route.pages.set(pathId, page);
            prevRouter = page.router;
        })
        // handle scroll restoration
        let { x, y } = Router.scroll ?? {x: 0, y: 0};
        scrollTo(x, y);
        // event
        this.dispatchEvent(new Event('routeopen', {bubbles: true}));
        return this;
    }
}

export interface Router {
    route<
        P extends RoutePath, 
        B extends PageBuilder
    >(path: P, builder: B, handle?: (route: Route<P, B['params']>) => Route<P>): Router
    route<
        K extends RoutePath, 
        P extends RouteParamsStrings<K>, 
        F extends PageBuilderFunction<P>
    >(path: K, builder: F, handle?: (route: Route<K, P>) => Route<K, P>): this
    route<
        K extends RoutePath, 
        P extends RouteParamsStrings<K>, 
        F extends AsyncPageBuilder<P>
    >(path: K, builder: F, handle?: (route: Route<K, P>) => Route<K, P>): this
    route<P extends RoutePath>(path: P, builder: RouteBuilder<RouteParamsResolver<P>>, handle?: (route: Route<P>) => Route<P>): Router
    group<P extends RoutePath>(path: P, handle: <R extends Route<P>>(route: R) => R): this;
    notFound(builder: RouteBuilder<RouteParamsResolver<RoutePath>>): this;
}