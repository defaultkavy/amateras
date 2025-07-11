import { _Array_from, _instanceof, _Object_fromEntries, forEach } from "#lib/native";
import { Page } from "./Page";
import { BaseRouteNode, Route } from "./Route";

const _location = location;
const {origin} = _location;
const _history = history;
const toURL = (path: string | URL) => 
    _instanceof(path, URL) ? path : new URL(path.startsWith(origin) ? path : origin + path);
const [PUSH, REPLACE] = [1, 2] as const;
const historyHandler = (path: string | URL | Nullish, mode: 1 | 2) => {
    if (!path) return;
    const url = toURL(path);
    if (url.origin !== origin || url.href === _location.href) return this;
    history[mode === PUSH ? 'pushState' : 'replaceState']({}, '' , url)
    forEach(Router.routers, router => router.routes.size && router.resolve(path));
}
export class Router extends BaseRouteNode<''> {
    static pageRouters = new Map<Page, Router>();
    static routers = new Set<Router>();
    pageMap = new Map<string, Page>();
    constructor(page?: Page) {
        super('', () => [], 'router')
        Router.routers.add(this);
        if (page) Router.pageRouters.set(page, this);
    }

    static open(path: string | URL | Nullish) {
        historyHandler(path, PUSH);
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
        const {pathname, searchParams, hash} = toURL(path);
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
                        if (!targetSnippet.startsWith(prefix)) continue routeLoop;
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
        for (const [route, pathId] of targetRoutes) {
            const page = await (this.pageMap.get(pathId) ?? (route ? route.build(routeData) : prevRoute.routes.get('404')?.build(routeData) ?? new Route('404', () => null).build()));
            const _document = document;
            _document && (_document.title = page.pageTitle() ?? _document.title);
            this.pageMap.set(pathId, page);
            if (prevPage) Router.pageRouters.get(prevPage)?.content(page);
            else this.content(page);
            prevPage = page;
            if (route) prevRoute = route;
        }
        return this;
    }

    listen() {
        const resolve = () => this.resolve(_location.href)
        addEventListener('popstate', resolve);
        resolve();
        return this;
    }
}