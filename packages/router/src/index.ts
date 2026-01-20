import { Link } from '#structure/Link';
import { NavLink } from '#structure/NavLink';
import { Page } from '#structure/Page';
import { Route } from '#structure/Route';
import { RouteGroup } from '#structure/RouteGroup';
import { RouteNode } from '#structure/RouteNode';
import { RouterProto } from '#structure/Router';
import { RouterConstructor } from '#structure/RouterConstructor';
import { symbol_ProtoType } from '@amateras/core/lib/symbols';
import { GlobalState } from '@amateras/core/structure/GlobalState';
import { Proto } from '@amateras/core/structure/Proto';
import { _instanceof, _Object_assign, isFunction, map } from '@amateras/utils';
import './global';
import type { PageLayout } from './types';

declare module "@amateras/core/structure/GlobalState" {
    export interface GlobalState {
        title: string | null
        router: {
            routers: Set<RouterProto>;
            resolve: (path: string) => Promise<void>[];
            href: URL;
            routes: Route[];
            matchPaths: string[];
            navlinks: Set<NavLink>;
        }
    }
}

let routePlannerPrototype = {
    route(this: Route | RouterProto, path: string, layout: PageLayout<string>, handle?: (route: Route) => void) {
        let route = new RouteNode(path, layout);
        this.routes.set(path, route);
        handle?.(route);
    },

    group(this: Route | RouterProto, path: string, handle?: (route: Route) => void) {
        let group = new RouteGroup(path);
        this.routes.set(path, group);
        handle?.(group);
    },

    notfound() {

    }
}

_Object_assign(Route.prototype, routePlannerPrototype);
_Object_assign(RouterProto.prototype, routePlannerPrototype);
_Object_assign(GlobalState.prototype, {
    router: {
        routers: new Set<RouterProto>(),
        resolve(this, path: string) {
            return map(this.routers, router => router.resolve(path));
        },
        href: new URL('http://localhost'),
        routes: [],
        matchPaths: [],
        navlinks: new Set()
    }
})

GlobalState.disposers.add(({router}) => {
    router.routers.clear();
    router.routes = [];
    router.matchPaths = [];
    router.navlinks.clear();
})

_Object_assign($, {
    router: (handle: ($$: RouterProto) => void) => RouterConstructor(handle),
    open: RouterProto.open,
    replace: RouterProto.replace,
    back: RouterProto.back,
    forward: RouterProto.forward,
    scrollRestoration: RouterProto.scrollRestoration,

    title(title: string) {
        let parent = Proto.proto;
        if (_instanceof(parent, Page)) {
            parent.title = title;
        }
    }
})

globalThis.Link = Link;
globalThis.NavLink = NavLink;

$.process.craft.add((value) => {
    if (isFunction(value) && value[symbol_ProtoType] === 'Router') {
        let proto = Proto.proto;
        let router = new value() as RouterProto;
        proto?.global.router.routers.add(router);
        router.parent = proto;
        return router;
    }
})

export * from "#structure/Link";
export * from "#structure/Page";
export * from "#structure/Route";
export * from "#structure/RouteGroup";
export * from "#structure/RouteNode";
export * from "#structure/Router";
export * from "#structure/RouteSlot";

