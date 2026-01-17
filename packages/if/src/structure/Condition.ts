import { symbol_Statement } from "@amateras/core/lib/symbols";
import { ProxyProto } from "@amateras/core/structure/ProxyProto";
import { forEach } from "@amateras/utils";
import type { ConditionStatement } from "./ConditionStatement";

export class Condition extends ProxyProto {
    static [symbol_Statement] = true;
    statements = new Set<ConditionStatement>();
    declare protos: Set<ConditionStatement>;
    declare layout: null;

    override build() {
        // run base build method with empty protos
        super.build(false);
        // set condition matched proto
        this.validate()?.build();
        // update function for Signal subscribe
        let update = () => {
            let matchProto = this.validate();
            if (!matchProto?.builded) matchProto?.build();
            forEach(this.statements, proto => proto !== matchProto && proto.removeNode())
            this.node?.replaceWith(...this.toDOM());
        }
        // build statements proto and subscribe expression signal
        forEach(this.statements, proto => {
            proto.exp$?.subscribe(update);
            proto.disposers.add(() => proto.exp$?.unsubscribe(update));
        })
        return this;
    }

    validate() {
        this.clear();
        for (let proto of this.statements) {
            if (proto.validate()) {
                proto.parent = this;
                return proto;
            }
        }
    }
}