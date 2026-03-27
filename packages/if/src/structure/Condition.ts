import { symbol_Statement } from "@amateras/core";
import { ProxyProto } from "@amateras/core";
import { _null, forEach } from "@amateras/utils";
import type { ConditionStatement } from "./ConditionStatement";

export class Condition extends ProxyProto {
    static override [symbol_Statement] = true;
    statements: ConditionStatement[] | null = _null;
    declare layout: null;
    statement: ConditionStatement | null = _null;

    override build() {
        // run base build method with empty protos
        super.build(false);
        // set condition matched proto
        this.validate()?.build();
        // update function for Signal subscribe
        let update = () => {
            let matchProto = this.validate();
            if (!matchProto?.builded) matchProto?.build();
            if (this.statement === matchProto) return;
            this.statement = matchProto ?? _null;
            forEach(this.statements, proto => proto !== matchProto && proto.removeNode())
            this.node?.replaceWith(...this.toDOM());
            this.parent?.mutate();
        }
        // build statements proto and subscribe expression signal
        forEach(this.statements, proto => {
            proto.exp$?.subscribe(update);
            proto.ondispose(() => {
                proto.exp$?.unsubscribe(update)
            });
        })
        return this;
    }

    override dispose(): void {
        super.dispose();
        forEach(this.statements, statement => statement.dispose());
        this.statement = _null;
        this.statements = _null;
    }

    validate() {
        this.clear();
        if (this.statements) for (let proto of this.statements) {
            if (proto.validate()) {
                this.append(proto);
                return proto;
            }
        }
    }
}