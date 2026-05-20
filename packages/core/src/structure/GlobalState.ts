import { Utils } from '@amateras/utils';
import { Proto } from "./Proto";

export type GlobalStateInitial = (global: GlobalState) => object | void;

export class GlobalState {
    static disposers = new Set<(global: GlobalState) => void>()
    promises = new Set<Promise<any>>();
    root: Proto;
    static initials = new Set<GlobalStateInitial>();
    constructor(root: Proto) {
        Utils.forEach(GlobalState.initials, initial => {
            const obj = initial(this);
            if (obj) Utils.assign(this, obj);
        })
        this.root = root;
        root.listen('dispose', () => this.dispose());
    }
    
    dispose() {
        this.promises.clear();
        this.root = Utils.Null as any;
        Utils.forEach(GlobalState.disposers, disposer => disposer(this));
    }

    static assign(initial: GlobalStateInitial) {
        this.initials.add(initial);
    }

    asyncTask(promise: Promise<any>) {
        this.promises.add(promise);
        promise.finally(() => this.promises.delete(promise));
        return promise;
    }
}