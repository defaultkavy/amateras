import type { AnchorTarget } from "#html/$Anchor";
import { _Object_assign, forEach } from "#lib/native";
import type { $NodeContentResolver } from "#node/$Node";
import type { Page } from "./node/Page";
import { Route } from "./node/Route";
import { Router } from "./node/Router";
import { RouterAnchor } from "./node/RouterAnchor";
export * from "./node/Route";
export * from "./node/Router";
export * from "./node/Page";
export * from "./node/RouterAnchor";

declare module 'amateras/core' {
    export function $<P extends string>(nodeName: 'route', path: P, builder: RouteBuilder<Route<P>, RouteDataResolver<P>>): Route<P>;
    export function $(nodeName: 'router', page?: Page<any>): Router;
    export function $(nodeName: 'ra'): RouterAnchor;
    export namespace $ {
        export function open(url: string | URL | Nullish, target: AnchorTarget): typeof Router;
        export function replace(url: string | URL | Nullish): typeof Router;
        export function back(): typeof Router;
        export function forward(): typeof Router;
    }
}

declare global {
    interface GlobalEventHandlersEventMap {
        'routeopen': Event;
    }
}

// assign methods
_Object_assign($, {
    open: Router.open.bind(Router),
    replace: Router.replace.bind(Router),
    back: Router.back.bind(Router),
    forward: Router.forward.bind(Router)
});
// define styles
forEach([
    `router{display:block}`,
    `page{display:block}`
], $.style);
// assign nodes
$.assign([
    ['router', Router],
    ['route', Route],
    ['ra', RouterAnchor]
])

export type RouteData = { params: any, query: any }
export type RouteDataResolver<P extends string> = { params: Prettify<PathParams<P>>, query: Prettify<PathQuery<P>> }
export type AsyncRoute<P extends string> = () => Promise<{default: Route<P>}>
export type RouteBuilder<R extends Route<any>, D extends RouteData> = (page: Page<R, D>) => OrPromise<$NodeContentResolver<Page<R, D>>>;

type PathParams<Path> = Path extends `${infer Segment}/${infer Rest}`
    ? Segment extends `${string}:${infer Param}` 
        ? Record<Param, string> & PathParams<Rest> 
        : PathParams<Rest>
    : Path extends `${string}:${infer Param}?${infer Query}`
        ? Record<Param, string> 
    : Path extends `${string}:${infer Param}` 
        ? Record<Param, string> 
        : {}

type PathQuery<Path> = Path extends `${string}?${infer Segment}`
    ? PathQuery_SetRecord<Segment>
    : Path extends `&${infer Segment}`
        ? PathQuery_SetRecord<Segment>
        : {}

type PathQuery_SetRecord<Segment extends string> = Segment extends `${infer Param}&${infer Rest}` 
    ? Record<Param, string> & PathQuery<`&${Rest}`>
    : Record<Segment, string>