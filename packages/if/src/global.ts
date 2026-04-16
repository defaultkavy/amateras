import type { Condition } from "#structure/Condition";
import * as _Else from "#structure/Else";
import * as _ElseIf from "#structure/ElseIf";
import * as _If from "#structure/If";
import type { Signal } from "@amateras/signal";
import type { IfLayout } from ".";

declare global {
    export var If: typeof _If.If
    export var Else: typeof _Else.Else
    export var ElseIf: typeof _ElseIf.ElseIf

    export namespace $ {
        export interface Overload<I> {
            if: [
                input: [typeof _If.If | typeof _ElseIf.ElseIf, signal: OrArray<Signal>],
                output: Condition,
                args: [layout: I[1] extends OrArray<Signal> ? IfLayout<I[1]> : never]
            ]
            else: [
                input: [typeof _Else.Else],
                output: Condition,
                args: [layout: _Else.ElseLayout]
            ]
        }
    }
}