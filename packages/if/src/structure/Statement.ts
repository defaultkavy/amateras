import { Proto, type ProtoLayout } from "@amateras/core/structure/Proto";
import type { Signal } from "@amateras/signal/structure/Signal";

export abstract class StatementProto extends Proto {
    exp$: Signal<any> | null;
    declare layout: ProtoLayout;
    constructor(expression: Signal<any> | null, layout: ProtoLayout) {
        super(layout);
        this.exp$ = expression;
    }

    validate() {
        if (!this.exp$) return true;
        return !!this.exp$.value;
    }
}