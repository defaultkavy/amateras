import { _null } from "@amateras/utils";
import { Proto, type ProtoBuilder } from "./Proto";

export class NodeProto<N extends Node & ChildNode = Node & ChildNode> extends Proto {
    node: null | N = _null;
    modifiers = new Set<(node: N) => void>();
    constructor(builder?: ProtoBuilder) {
        super(builder);
    }

    dom(callback: (node: N) => void) {
        this.modifiers.add(callback);
    }

    removeNode(): void {
        this.node?.remove();
    }
}