import { _Object_assign } from "./utils";

declare global {
    export import debug = Debug
}

export namespace Debug {
    export const generateHeapsnapshot = async () => {
        let snapshot = Bun.generateHeapSnapshot('v8');
        let size = await Bun.write(`./heapsnapshot/${new Date().toISOString()}.heapsnapshot`, snapshot);
        return size
    }
}

global.debug = Debug;