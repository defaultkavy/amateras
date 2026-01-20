import { symbol_Statement } from "@amateras/core/lib/symbols";
import { ProxyProto } from "@amateras/core/structure/ProxyProto";
import type { Signal } from "@amateras/signal/structure/Signal";
import { _null, forEach } from "@amateras/utils";
import { Case, type CaseLayout } from "./Case";
import { Default, type DefaultLayout } from "./Default";

export type MatchLayout<T> = (match: MatchCraftFunction<T>) => void;
export interface MatchCraftFunction<T> {
    (d: typeof Default, layout: DefaultLayout): void;
    (c: typeof Case, condition: T | T[], layout: CaseLayout): void;
}

export class Match<T = any> extends ProxyProto {
    static override [symbol_Statement] = true;
    exp$: Signal<T>
    declare protos: Set<Case>;
    cases = new Set<Case>();
    matched: Case | Default | null = _null;
    #default: Default | null = _null;
    constructor(expression: Signal<T>, layout: MatchLayout<T>) {
        super(() => {
            layout((constructor, arg1, arg2?) => {
                $(constructor as any, arg1, arg2);
            });
        });
        this.exp$ = expression;
    }

    override build(): this {
        super.build();
        this.validate();
        // update function for Signal subscribe
        let update = () => {
            let prevMatchedProto = this.matched;
            let matchProto = this.validate();
            if (prevMatchedProto === matchProto) return;
            forEach(this.cases, proto => proto !== matchProto && proto.removeNode())
            if (matchProto !== this.#default) this.#default?.removeNode();
            this.node?.replaceWith(...this.toDOM());
        }
        // build cases proto and subscribe expression signal
        forEach(this.cases, proto => {
            proto.build();
            this.exp$.subscribe(update);
            proto.disposers.add(() => this.exp$.unsubscribe(update));
        })
        this.#default?.build();
        return this;
    }

    case(condition: T, layout: CaseLayout) {
        let caseProto = new Case(condition, layout);
        this.cases.add(caseProto);
        return caseProto;
    }

    default(layout: DefaultLayout) {
        let defaultProto = new Default(layout);
        this.#default = defaultProto;
        return defaultProto;
    }

    validate() {
        this.clear();
        for (let proto of this.cases) {
            if (proto.condition.includes(this.exp$.value)) {
                proto.parent = this;
                return this.matched = proto;
            }
        }
        if (this.#default) {
            this.#default.parent = this;
            return this.matched = this.#default;
        }
    }
}