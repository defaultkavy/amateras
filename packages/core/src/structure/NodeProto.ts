import { Utils } from '@amateras/utils';
import { Proto } from "./Proto";
import { onclient } from "#env";

export class NodeProto<N extends Node & ChildNode = Node & ChildNode> extends Proto {
    node: null | N = Utils.Null;
    constructor(layout?: $.Layout) {
        super(layout);
    }

    override dispose(): void {
        super.dispose();
        this.node = Utils.Null;
    }

    inDOM() {
        if (onclient()) return document.contains(this.node);
        return false;
    }

    override removeNode(): void {
        this.node?.remove();
    }

    protected DOMProcess() {
        let thisNode = this.node;
        if (thisNode) {
            let protos = this.protos;
            let nodes = Utils.map(protos.filter(proto => proto.visible), proto => proto.toDOM()).flat();
            let nextNode: Node | null = Utils.Null;
            Utils.forEach(nodes, (node, i) => {
                let currentNode = thisNode.childNodes[i];
                if (currentNode !== node) {
                    if (!nodes.includes(currentNode as any)) nextNode = currentNode ?? Utils.Null;
                    else nextNode = thisNode.childNodes[i + 1] ?? Utils.Null;
                    thisNode.insertBefore(node, nextNode);
                }
            })
        }
    }
}