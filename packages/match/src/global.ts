import * as _Case from "#structure/Case";
import * as _Default from "#structure/Default";
import * as _Match from "#structure/Match";
import type { Signal } from "@amateras/signal";

declare global {
    export var Match: typeof _Match.Match
    export var Case: typeof _Case.Case
    export var Default: typeof _Default.Default

    export function $<T>(Match: typeof _Match.Match, expression: Signal<T>, layout: _Match.MatchLayout<T>): _Match.Match<T>
    export function $(Case: typeof _Case.Case, condition: any, layout: _Case.CaseLayout): _Case.Case;
    export function $(Default: typeof _Default.Default, layout: _Default.DefaultLayout): _Default.Default;
}