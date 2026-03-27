import { symbol_Statement } from "@amateras/core";
import { Proto } from "@amateras/core";
import type { Signal } from "@amateras/signal";
import { _null } from "@amateras/utils";

export type ConditionLayout = (value: Signal<any> | null) => void;

export abstract class ConditionStatement extends Proto {
    static override [symbol_Statement] = true;
    exp$: Signal<any> | null;
    constructor(expression: Signal<any> | null, layout: ConditionLayout) {
        super(() => layout(this.exp$));
        this.exp$ = expression;
    }

    override dispose(): void {
        super.dispose();
        this.exp$ = _null;
    }

    validate() {
        if (!this.exp$) return true;
        return !!this.exp$.value;
    }
}