import { _null } from "@amateras/utils";
import { Proto } from "./Proto";
import { onclient } from "#env";

export class NodeProto<N extends Node & ChildNode = Node & ChildNode> extends Proto {
    node: null | N = _null;
    modifiers: null | ((node: N) => void)[] = _null
    constructor(layout?: $.Layout) {
        super(layout);
    }

    ondom(callback: (node: N) => void) {
        this.modifiers = this.modifiers ?? [];
        this.modifiers.push(callback);
    }

    override dispose(): void {
        super.dispose();
        this.node = _null;
        this.modifiers = _null
    }

    inDOM() {
        if (onclient()) return document.contains(this.node);
        return false;
    }

    override removeNode(): void {
        this.node?.remove();
    }
}