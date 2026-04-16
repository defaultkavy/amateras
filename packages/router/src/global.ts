import * as _Link from "#structure/Link";
import * as _NavLink from "#structure/NavLink";
import * as _Router from "#structure/Router";
import type { RouterConstructor, RouterHandle } from "#structure/RouterConstructor";
import type { RouteSlot } from "#structure/RouteSlot";
import type { Proto } from "@amateras/core";

declare global {
    export var Link: typeof _Link.Link;
    export var NavLink: typeof _NavLink.NavLink;

    export type Link = _Link.Link;
    export type NavLink = _NavLink.NavLink;

    export namespace $ {
        export function router(handle: RouterHandle): RouterConstructor;

        export function open(path: string, target?: string): void;
        export function forward(): void;
        export function back(): void;
        export function replace(path: string): void;
        export function scrollRestoration(): void;

        export function title(title: OrPromise<string>, parent?: Proto | null): void;

        interface ProtoEventMap {
            pageswitch: [slot: RouteSlot, direction: _Router.RouterDicrection]
        }

        interface Overload<I> {
            router: [
                input: [RouterConstructor],
                output: [_Router.Router],
                args: []
            ]
        }
    }
}