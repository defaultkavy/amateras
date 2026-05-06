import { _null } from "@amateras/utils";
import { Proto } from "./Proto";
import { onclient } from "#env";

export class NodeProto<N extends Node & ChildNode = Node & ChildNode> extends Proto {
    node: null | N = _null;
    constructor(layout?: $.Layout) {
        super(layout);
    }

    /**@deprecated - use `Proto.listen` on 'dom' event instead */
    ondom(callback: (node: N) => void) {
        this.listen('dom', callback as any)
    }

    override dispose(): void {
        super.dispose();
        this.node = _null;
    }

    inDOM() {
        if (onclient()) return document.contains(this.node);
        return false;
    }

    override removeNode(): void {
        this.node?.remove();
    }
}