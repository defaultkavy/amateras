import { _null, _Object_assign, forEach } from "@amateras/utils";
import type { Proto } from "./Proto";

export class GlobalState {
    static disposers = new Set<(global: GlobalState) => void>()
    promises = new Set<Promise<any>>();
    root: Proto;
    constructor(root: Proto) {
        this.root = root;
        root.ondispose(() => this.dispose());
    }
    dispose() {
        this.promises.clear();
        this.root = _null as any;
        forEach(GlobalState.disposers, disposer => disposer(this));
    }

    static assign(obj: object) {
        _Object_assign(GlobalState.prototype, obj);
    }

    asyncTask(promise: Promise<any>) {
        this.promises.add(promise);
        promise.finally(() => this.promises.delete(promise));
    }
}