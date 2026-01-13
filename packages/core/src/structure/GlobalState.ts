import type { Proto } from "@amateras/core/structure/Proto";

export class GlobalState {
    constructor(proto: Proto) {
        let root = proto.root;
        if (root) return root.global;
    }
}