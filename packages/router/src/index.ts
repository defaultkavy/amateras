import type { Page } from "#node/Page";
import { Router } from "#node/Router";
import { PageBuilder } from "#structure/PageBuilder";
import { Route, type RouteBuilder, type RouteParams } from "#structure/Route";
import { _Object_assign, _bind, forEach } from "@amateras/utils";
import type { AnchorTarget } from "../../html/src/node/$Anchor";

declare module '@amateras/core' {
    export namespace $ {
        export function route<Params extends RouteParams = []>(builder: (page: Page<Params>) => OrPromise<Page<Params>>): PageBuilder<Params>;
        export function open(url: string | URL | Nullish, target?: AnchorTarget): typeof Router;
        export function replace(url: string | URL | Nullish): typeof Router;
        export function back(): typeof Router;
        export function forward(): typeof Router;
        export interface $NodeMap {
            'router': typeof Router;
        }
    }
}

declare global {
    interface GlobalEventHandlersEventMap {
        'routeopen': Event;
    }
}

let prototype = {
    route(this: { routes: Map<string, Route> }, path: string, builder: RouteBuilder, handle?: (route: Route) => Route) {
        const route = new Route<any>(path, builder);
        handle?.(route);
        this.routes.set(path, route);
        return this;
    },

    group(this: { routes: Map<string, Route> }, path: string, handle: (route: Route) => Route) {
        this.routes.set(path, handle(new Route<any>(path)))
        return this;
    },

    notFound(this: { routes: Map<string, Route> }, builder: RouteBuilder) {
        this.routes.set('notfound', new Route('notfound', builder));
        return this;
    }
}

// assign methods
_Object_assign(Router.prototype, prototype)
_Object_assign(Route.prototype, prototype)
_Object_assign($, {
    route: (builder: (page: Page) => Page) => new PageBuilder(builder),
    open: _bind(Router.open, Router),
    replace: _bind(Router.replace, Router),
    back: _bind(Router.back, Router),
    forward: _bind(Router.forward, Router)
})
// assign node
$.assign(['router', Router])
// use style
forEach([
    `router{display:block}`,
    `page{display:block}`
], $.style);

export * from '#node/Page';
export * from '#node/Router';
export * from '#node/RouterAnchor';
export * from '#structure/PageBuilder';
export * from '#structure/Route';