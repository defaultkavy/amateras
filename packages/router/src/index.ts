import { Link } from '#structure/Link';
import { NavLink } from '#structure/NavLink';
import { Page } from '#structure/Page';
import { Route } from '#structure/Route';
import { RouteGroup } from '#structure/RouteGroup';
import { RouteNode } from '#structure/RouteNode';
import { Router } from '#structure/Router';
import { RouterConstructor } from '#structure/RouterConstructor';
import { onclient, onserver, symbol_ProtoType } from '@amateras/core';
import { GlobalState } from '@amateras/core';
import { Proto } from '@amateras/core';
import { Utils } from '@amateras/utils';
import './global';
import type { PageLayout } from './types';

declare module "@amateras/core" {
    export interface GlobalState {
        title: string | null
        router: {
            routers: Set<Router>;
            resolve: (path: string) => Promise<void>[];
            url: URL;
            routes: Route[];
            matchPaths: string[];
            navlinks: Set<NavLink>;
            scrollQueue: Set<Promise<any>>;
            postScrollRestoration(promise: Promise<any>): void;
        }
    }
}

let routePlannerPrototype = {
    route(this: Route | Router, path: string, layout: PageLayout<string>, handle?: (route: Route) => void) {
        let route = new RouteNode(path, layout);
        this.routes.set(path, route);
        handle?.(route);
        return this;
    },

    group(this: Route | Router, path: string, handle?: (route: Route) => void) {
        let group = new RouteGroup(path);
        this.routes.set(path, group);
        handle?.(group);
        return this;
    }
}

Utils.assign(Route.prototype, routePlannerPrototype);
Utils.assign(Router.prototype, routePlannerPrototype);
GlobalState.assign(() => ({
    router: {
        routers: new Set<Router>(),
        resolve(this, path: string) {
            return Utils.map(this.routers, router => router.resolve(path));
        },
        url: onclient() ? new URL(location.href) : new URL('http://localhost'),
        routes: [],
        matchPaths: [],
        navlinks: new Set(),
        scrollQueue: new Set<Promise<any>>(),
        postScrollRestoration(promise: Promise<any>) {
            promise.finally(() => this.scrollQueue.delete(promise));
            this.scrollQueue.add(promise);
        }
    }
}))

GlobalState.disposers.add(({router}) => {
    router.routers.clear();
    router.routes = [];
    router.matchPaths = [];
    router.navlinks.clear();
})

Utils.assign($, {
    router: (handle: ($$: Router) => void) => RouterConstructor(handle),
    open: Router.open,
    replace: Router.replace,
    back: Router.back,
    forward: Router.forward,
    scrollRestoration: Router.scrollRestoration,

    title(title: OrPromise<string>, parent: Proto | null = Proto.proto) {
        let page = parent?.findAbove<Page>(proto => Utils.is(proto, Page));
        if (page) {
            page.title = title;
            page.updateTitle();
        }
    }
})

globalThis.Link = Link;
globalThis.NavLink = NavLink;

$.middleware.craft.add((value) => {
    if (Utils.isFunction(value) && value[symbol_ProtoType] === 'Router') {
        let proto = Proto.proto;
        let router = new value() as Router;
        proto?.global.router.routers.add(router);
        return router;
    }
})

if (onserver()) $.middleware.ssr.add(($html, $head) => {
    const $title = $.context($head, () => $.craft('title', () => $([$html.global.title])));
    $head.append($title);
    $title.build();
})

export * from "#structure/Link";
export * from "#structure/Page";
export * from "#structure/Route";
export * from "#structure/RouteGroup";
export * from "#structure/RouteNode";
export * from "#structure/Router";
export * from "#structure/RouteSlot";

