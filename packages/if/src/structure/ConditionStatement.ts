import { symbol_Statement } from "@amateras/core/lib/symbols";
import { Proto } from "@amateras/core/structure/Proto";
import type { Signal } from "@amateras/signal/structure/Signal";

export abstract class ConditionStatement extends Proto {
    static [symbol_Statement] = true;
    exp$: Signal<any> | null;
    declare layout: $.Layout;
    builded = false;
    constructor(expression: Signal<any> | null, layout: $.Layout) {
        super(layout);
        this.exp$ = expression;
    }

    build(children?: boolean): this {
        super.build(children);
        this.builded = true;
        return this;
    }

    validate() {
        if (!this.exp$) return true;
        return !!this.exp$.value;
    }
}