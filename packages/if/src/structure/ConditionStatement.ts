import { symbol_Statement } from "@amateras/core";
import { Proto } from "@amateras/core";
import type { Signal } from "@amateras/signal";
import { Utils } from '@amateras/utils';

export type ConditionLayout = (...value: Signal<any>[]) => void;

export abstract class ConditionStatement extends Proto {
    static override [symbol_Statement] = true;
    exps: Signal<any>[] | null;
    constructor(expression: OrArray<Signal<any>> | null, layout: ConditionLayout) {
        super(() => layout(...this.exps ?? []));
        this.exps = expression ? Utils.toArray(expression) : Utils.Null;
    }

    override dispose(): void {
        super.dispose();
        this.exps = Utils.Null;
    }

    override mutate(): void {
        super.mutate();
        this.parent?.mutate();
    }

    validate() {
        if (!this.exps) return true;
        return !this.exps.find(exp$ => !exp$.value)
    }
}