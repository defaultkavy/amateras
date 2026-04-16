import { _null, _Object_assign, forEach } from "@amateras/utils";
import { Proto } from "./Proto";

export type GlobalStateInitial = (global: GlobalState) => object | void;

export class GlobalState {
    static disposers = new Set<(global: GlobalState) => void>()
    promises = new Set<Promise<any>>();
    root: Proto;
    static initials = new Set<GlobalStateInitial>();
    constructor(root: Proto) {
        forEach(GlobalState.initials, initial => {
            const obj = initial(this);
            if (obj) _Object_assign(this, obj);
        })
        this.root = root;
        root.ondispose(() => this.dispose());
    }
    
    dispose() {
        this.promises.clear();
        this.root = _null as any;
        forEach(GlobalState.disposers, disposer => disposer(this));
    }

    static assign(initial: GlobalStateInitial) {
        this.initials.add(initial);
    }

    asyncTask(promise: Promise<any>) {
        this.promises.add(promise);
        promise.finally(() => this.promises.delete(promise));
    }
}