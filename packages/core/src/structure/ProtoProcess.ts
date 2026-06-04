import { Utils } from "@amateras/utils";
import { Proto } from "./Proto";

export class ProtoProcess {
    proto: Proto | null;
    tasks = new Set<Task>();
    constructor(proto = Proto.proto) {
        if (!proto) throw 'ProtoProcess error: proto context is missing';
        this.proto = proto;
    }

    exec(fn: () => any) {
        this.tasks.add({fn, await: false});
        return this;
    }

    await(resolver: Promise<any> | (() => any)) {
        this.tasks.add({fn : Utils.isFunction(resolver) ? resolver : async () => await resolver, await: true});
        return this;
    }
    
    async run() {
        for (const task of this.tasks) {
            if (task.await) await this.proto?.global.asyncTask($.context(this.proto, task.fn));
            else this.proto?.global.asyncTask($.context(this.proto, task.fn));
        }
        this.dispose();
        return this;
    }

    dispose() {
        this.tasks.clear();
        this.proto = null;
    }
}

interface Task {
    fn: () => any;
    await: boolean;
}