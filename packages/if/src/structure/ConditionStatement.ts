import { symbol_Statement } from "@amateras/core";
import { Proto } from "@amateras/core";
import type { Signal } from "@amateras/signal";

export abstract class ConditionStatement extends Proto {
    static override [symbol_Statement] = true;
    exp$: Signal<any> | null;
    declare layout: $.Layout;
    builded = false;
    constructor(expression: Signal<any> | null, layout: $.Layout) {
        super(layout);
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