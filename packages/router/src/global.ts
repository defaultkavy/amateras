import * as _Link from "#structure/Link";
import * as _Router from "#structure/Router";

declare global {
    export var Router: typeof _Router.Router;
    export var Link: typeof _Link.Link;
    export function $(Router: typeof _Router.Router, layout: ($$: _Router.Router) => void): _Router.Router;
    export function $(Link: typeof _Link.Link, layout?: ($$: _Link.Link) => void): _Link.Link;
    export function $(Link: typeof _Link.Link, props?: $.Props, layout?: ($$: _Link.Link) => void): _Link.Link;

    export namespace $ {
        export function open(path: string, target?: string): void;
        export function forward(): void;
        export function back(): void;
        export function replace(path: string): void;

        export function title(title: string): void;
    }
}