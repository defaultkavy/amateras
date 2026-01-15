import { ProxyProto } from "@amateras/core/structure/ProxyProto";
import type { Signal } from "@amateras/signal/structure/Signal";
import { _null, forEach } from "@amateras/utils";
import { Case, type CaseLayout } from "./Case";

export type MatchLayout<T> = (match: MatchCraftFunction<T>) => void;
export type MatchCraftFunction<T> = (c: typeof Case, condition: T | T[], layout: CaseLayout) => void;

export class Match<T = any> extends ProxyProto {
    exp$: Signal<T>
    declare protos: Set<Case>;
    cases = new Set<Case>();
    matched: Case | null = _null;
    constructor(expression: Signal<T>, layout: MatchLayout<T>) {
        super(() => {
            layout((_: typeof Case, condition: any, layout: CaseLayout) => this.case(condition, layout));
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
            this.node?.replaceWith(...this.toDOM());
        }
        // build cases proto and subscribe expression signal
        forEach(this.cases, proto => {
            proto.build();
            this.exp$.subscribe(update);
            proto.disposers.add(() => this.exp$.unsubscribe(update));
        })
        return this;
    }

    case(condition: T, layout: CaseLayout) {
        let caseProto = new Case(condition, layout);
        this.cases.add(caseProto);
        return caseProto;
    }

    validate() {
        this.clear();
        for (let proto of this.cases) {
            if (proto.condition.includes(this.exp$.value)) {
                proto.parent = this;
                return this.matched = proto;
            }
        }
    }
}