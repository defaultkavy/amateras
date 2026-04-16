import * as _Case from "#structure/Case";
import * as _Default from "#structure/Default";
import * as _Match from "#structure/Match";
import type { Signal } from "@amateras/signal";

declare global {
    export var Match: typeof _Match.Match
    export var Case: typeof _Case.Case
    export var Default: typeof _Default.Default

    export namespace $ {
        export interface Overload<I> {
            match: [
                input: [typeof _Match.Match, Signal],
                output: I[1] extends Signal<infer T> ? _Match.Match<T> : never,
                args: [layout: I[1] extends Signal<infer T> ? _Match.MatchLayout<T> : never]
            ]
        }
    }
}