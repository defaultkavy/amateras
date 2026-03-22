import type { Condition } from "#structure/Condition";
import * as _Else from "#structure/Else";
import * as _ElseIf from "#structure/ElseIf";
import * as _If from "#structure/If";
import type { SignalType } from "@amateras/signal";

declare global {
    export var If: typeof _If.If
    export var Else: typeof _Else.Else
    export var ElseIf: typeof _ElseIf.ElseIf

    export function $<T>(statement: typeof _If.If, signal: SignalType<T>, layout: _If.IfLayout<T>): Condition;
    export function $<T>(statement: typeof _ElseIf.ElseIf, signal: SignalType<T>, layout: _ElseIf.ElseIfLayout<T>): Condition;
    export function $(statement: typeof _Else.Else, layout: _Else.ElseLayout): Condition;
}