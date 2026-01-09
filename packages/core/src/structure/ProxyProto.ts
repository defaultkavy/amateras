import { onclient } from "#env";
import { forEach } from "@amateras/utils";
import { NodeProto } from "./NodeProto";
import type { ProtoBuilder } from "./Proto";

export class ProxyProto extends NodeProto<Text> {
    declare node: Text | null
    constructor(builder?: ProtoBuilder) {
        super(builder);
        if (onclient()) this.node = new Text();
    }

    toDOM(): Node[] {
        return [this.node!, ...super.toDOM()]
    }

    removeNode(): void {
        super.removeNode();
        forEach(this.protos, proto => proto.removeNode())
    }
}