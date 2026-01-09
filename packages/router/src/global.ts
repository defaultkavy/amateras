import * as _Router from "#structure/Router";
import * as _Link from "#structure/Link";

declare global {
    export var Router: typeof _Router.Router;
    export var Link: typeof _Link.Link;
    export function $(Router: typeof _Router.Router, builder: ($$: _Router.Router) => void): _Router.Router;
    export function $(Link: typeof _Link.Link, builder?: ($$: _Link.Link) => void): _Link.Link;
    export function $(Link: typeof _Link.Link, props?: $.Props, builder?: ($$: _Link.Link) => void): _Link.Link;

    export namespace $ {
        export function open(path: string, target?: string): void;
        export function forward(): void;
        export function back(): void;
        export function replace(path: string): void;
    }
}