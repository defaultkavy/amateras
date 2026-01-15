import * as _Link from "#structure/Link";
import * as _Router from "#structure/Router";
import type { Router, RouterHandle } from "#structure/RouterConstructor";

declare global {
    export var Link: typeof _Link.Link;
    export function $(Router: Router): _Router.RouterProto;

    export namespace $ {
        export function router(handle: RouterHandle): Router;

        export function open(path: string, target?: string): void;
        export function forward(): void;
        export function back(): void;
        export function replace(path: string): void;

        export function title(title: string): void;
    }
}