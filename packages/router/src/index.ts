import { Link } from '#structure/Link';
import { Page } from '#structure/Page';
import { Route } from '#structure/Route';
import { RouteGroup } from '#structure/RouteGroup';
import { RouteNode } from '#structure/RouteNode';
import { Router } from '#structure/Router';
import { Proto } from '@amateras/core/structure/Proto';
import { _instanceof, _Object_assign } from '@amateras/utils';
import './global';
import type { PageBuilder } from './types';

let routePlannerPrototype = {
    route(this: Route | Router, path: string, builder: PageBuilder<string>, handle?: (route: Route) => void) {
        let router = _instanceof(this, Router) ? this : this.router;
        let route = new RouteNode(router, path, builder);
        this.routes.set(path, route);
        handle?.(route);
    },

    group(this: Route | Router, path: string, handle?: (route: Route) => void) {
        let router = _instanceof(this, Router) ? this : this.router;
        let group = new RouteGroup(router, path);
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