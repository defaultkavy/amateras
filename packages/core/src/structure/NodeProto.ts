import { _null } from "@amateras/utils";
import { Proto } from "./Proto";

export class NodeProto<N extends Node & ChildNode = Node & ChildNode> extends Proto {
    node: null | N = _null;
    modifiers = new Set<(node: N) => void>();
    constructor(layout?: $.Layout) {
        super(layout);
    }

    ondom(callback: (node: N) => void) {
        this.modifiers.add(callback);
    }

    override removeNode(): void {
        this.node?.remove();
    }
}