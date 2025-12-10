import { _Object_assign } from "@amateras/utils";
import type { Node } from "./Node";

export class NodeList extends Set<Node> {
    constructor(node: Node[] = []) {
        super(node)
    }
}

_Object_assign(globalThis, { NodeList })