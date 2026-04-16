import { symbol_Statement } from "@amateras/core";
import { Proto } from "@amateras/core";
import type { Signal } from "@amateras/signal";
import { _null, toArray } from "@amateras/utils";

export type ConditionLayout = (...value: Signal<any>[]) => void;

export abstract class ConditionStatement extends Proto {
    static override [symbol_Statement] = true;
    exps: Signal<any>[] | null;
    constructor(expression: OrArray<Signal<any>> | null, layout: ConditionLayout) {
        super(() => layout(...this.exps ?? []));
        this.exps = expression ? toArray(expression) : _null;
    }

    override dispose(): void {
        super.dispose();
        this.exps = _null;
    }

    validate() {
        if (!this.exps) return true;
        return !this.exps.find(exp$ => !exp$.value)
    }
}