import { symbol_Statement } from "@amateras/core";
import { ProxyProto } from "@amateras/core";
import { Utils } from '@amateras/utils';
import type { ConditionStatement } from "./ConditionStatement";

export class Condition extends ProxyProto {
    static override [symbol_Statement] = true;
    declare layout: null;
    statement: ConditionStatement | null = Utils.Null;
    override virtual = true;

    override build() {
        // run base build method with empty protos
        super.build(false, false);
        // set condition matched proto
        this.validate()?.build();
        // update function for Signal subscribe
        let update = () => {
            let matchProto = this.validate();
            if (!matchProto?.builded) matchProto?.build();
            if (this.statement === matchProto) return;
            this.statement = matchProto ?? Utils.Null;
            Utils.forEach(this.protos, proto => !proto.visible && proto.removeNode());
            this.node?.replaceWith(...this.toDOM());
            this.parent?.mutate();
            this.parent?.dispatch('mutate', [], {bubbles: true});
        }
        // build statements proto and subscribe expression signal
        Utils.forEach(this.protos, proto => {
            Utils.forEach(proto.exps, exp$ => {
                exp$?.subscribe(update);
                proto.listen('dispose', () => {
                    exp$?.unsubscribe(update)
                });
            })
        })
        return this;
    }

    override get protos(): ConditionStatement[] {
        return super.protos as ConditionStatement[]
    }

    override dispose(): void {
        super.dispose();
        this.statement = Utils.Null;
    }

    override mutate(): void {
        super.mutate();
        this.parent?.mutate();
    }

    validate() {
        Utils.forEach(this.protos, proto => proto.visible = false);
        for (let proto of this.protos) {
            if (proto.validate()) {
                proto.visible = true;
                return proto;
            }
        }
    }
}