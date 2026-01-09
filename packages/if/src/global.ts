import * as _If from "#structure/If";
import * as _Else from "#structure/Else";
import * as _ElseIf from "#structure/ElseIf";
import type { Signal } from "@amateras/signal/structure/Signal";
import type { Condition } from "#structure/Condition";

declare global {
    export var If: typeof _If.If
    export var Else: typeof _Else.Else
    export var ElseIf: typeof _ElseIf.ElseIf

    export function $(statement: typeof _If.If, signal: Signal<any>, builder: _If.IfBuilder): Condition;
    export function $(statement: typeof _ElseIf.ElseIf, signal: Signal<any>, builder: _ElseIf.ElseIfBuilder): Condition;
    export function $(statement: typeof _Else.Else, signal: Signal<any>, builder: _Else.ElseBuilder): Condition;
}