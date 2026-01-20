import type { Condition } from "#structure/Condition";
import * as _Else from "#structure/Else";
import * as _ElseIf from "#structure/ElseIf";
import * as _If from "#structure/If";
import type { Signal } from "@amateras/signal/structure/Signal";

declare global {
    export var If: typeof _If.If
    export var Else: typeof _Else.Else
    export var ElseIf: typeof _ElseIf.ElseIf

    export function $(statement: typeof _If.If, signal: Signal<any>, layout: _If.IfLayout): Condition;
    export function $(statement: typeof _ElseIf.ElseIf, signal: Signal<any>, layout: _ElseIf.ElseIfLayout): Condition;
    export function $(statement: typeof _Else.Else, layout: _Else.ElseLayout): Condition;
}