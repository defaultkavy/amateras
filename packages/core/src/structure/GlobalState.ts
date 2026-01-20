import type { Proto } from "@amateras/core/structure/Proto";
import { forEach } from "@amateras/utils";

export class GlobalState {
    static disposers = new Set<(global: GlobalState) => void>()
    constructor(proto: Proto) {
        let root = proto.root;
        if (root) return root.global;
    }

    dispose() {
        forEach(GlobalState.disposers, disposer => disposer(this))
    }
}