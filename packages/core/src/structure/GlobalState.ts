import { _Object_assign, forEach } from "@amateras/utils";

export class GlobalState {
    static disposers = new Set<(global: GlobalState) => void>()
    promises = new Set<Promise<any>>();
    dispose() {
        this.promises.clear();
        forEach(GlobalState.disposers, disposer => disposer(this))
    }

    static assign(obj: object) {
        _Object_assign(GlobalState.prototype, obj);
    }

    asyncTask(promise: Promise<any>) {
        this.promises.add(promise);
        promise.finally(() => this.promises.delete(promise));
    }
}