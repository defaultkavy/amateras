import { Proto, type ProtoBuilder } from "@amateras/core/structure/Proto";
import type { Signal } from "@amateras/signal/structure/Signal";

export abstract class StatementProto extends Proto {
    exp$: Signal<any> | null;
    declare builder: ProtoBuilder;
    constructor(expression: Signal<any> | null, builder: ProtoBuilder) {
        super(builder);
        this.exp$ = expression;
    }

    validate() {
        if (!this.exp$) return true;
        return !!this.exp$.value;
    }
}