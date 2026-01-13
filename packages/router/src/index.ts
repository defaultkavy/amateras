import { Link } from '#structure/Link';
import { Page } from '#structure/Page';
import { Route } from '#structure/Route';
import { RouteGroup } from '#structure/RouteGroup';
import { RouteNode } from '#structure/RouteNode';
import { Router } from '#structure/Router';
import { Proto } from '@amateras/core/structure/Proto';
import { _instanceof, _Object_assign } from '@amateras/utils';
import './global';
import type { PageLayout } from './types';

declare module "@amateras/core/structure/GlobalState" {
    export interface GlobalState {
        title: string | null
    }
}

let routePlannerPrototype = {
    route(this: Route | Router, path: string, layout: PageLayout<string>, handle?: (route: Route) => void) {
        let route = new RouteNode(path, layout);
        this.routes.set(path, route);
        handle?.(route);
    },

    group(this: Route | Router, path: string, handle?: (route: Route) => void) {
        let group = new RouteGroup(path);
        this.routes.set(path, group);
        handle?.(group);
    },

    notfound() {

    }
}

_Object_assign(Route.prototype, routePlannerPrototype);
_Object_assign(Router.prototype, routePlannerPrototype);

_Object_assign($, {
    open: Router.open,
    replace: Router.replace,
    back: Router.back,
    forward: Router.forward,

    title(title: string) {
        let parent = Proto.proto;
        if (_instanceof(parent, Page)) {
            parent.title = title;
        }
    }
})

globalThis.Link = Link;
globalThis.Router = Router;

$.process.craft.add((value, routeBuilder) => {
    if (value === Router) {
        let router = new Router();
        router.parent = Proto.proto;
        routeBuilder(router);
        return router;
    }
})

export * from "#structure/Router";
