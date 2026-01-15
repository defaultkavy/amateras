import { ProxyProto } from "@amateras/core/structure/ProxyProto";
import { forEach } from "@amateras/utils";
import type { StatementProto } from "./Statement";

export class Condition extends ProxyProto {
    statements = new Set<StatementProto>();
    declare protos: Set<StatementProto>;
    declare layout: null;

    override build() {
        // run base build method with empty protos
        super.build();
        // set condition matched proto
        this.validate();
        // update function for Signal subscribe
        let update = () => {
            let matchProto = this.validate();
            forEach(this.statements, proto => proto !== matchProto && proto.removeNode())
            this.node?.replaceWith(...this.toDOM());
        }
        // build statements proto and subscribe expression signal
        forEach(this.statements, proto => {
            proto.build();
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