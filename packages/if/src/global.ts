import type { Condition } from "#structure/Condition";
import * as _Else from "#structure/Else";
import * as _ElseIf from "#structure/ElseIf";
import * as _If from "#structure/If";
import type { Signal, SignalObject } from "@amateras/signal";
import type { IfLayout } from ".";

declare global {
    export var If: typeof _If.If
    export var Else: typeof _Else.Else
    export var ElseIf: typeof _ElseIf.ElseIf

    export function $<T extends Signal | SignalObject<any>>(statement: typeof _If.If, signal: T, layout: IfLayout<T>): Condition;
    export function $<T extends Signal | SignalObject<any>>(statement: typeof _ElseIf.ElseIf, signal: T, layout: IfLayout<T>): Condition;
    export function $(statement: typeof _Else.Else, layout: _Else.ElseLayout): Condition;
}