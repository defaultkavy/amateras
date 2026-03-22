import { symbol_Statement } from "@amateras/core";
import { Proto } from "@amateras/core";
import type { Signal } from "@amateras/signal";

export type ConditionLayout = (value: Signal<any> | null) => void;

export abstract class ConditionStatement extends Proto {
    static override [symbol_Statement] = true;
    exp$: Signal<any> | null;
    declare layout: $.Layout;
    builded = false;
    constructor(expression: Signal<any> | null, layout: ConditionLayout) {
        super(() => layout(this.exp$));
        this.exp$ = expression;
    }

    override build(children?: boolean): this {
        super.build(children);
        this.builded = true;
        return this;
    }

    validate() {
        if (!this.exp$) return true;
        return !!this.exp$.value;
    }
}