import { _Object_assign } from "@amateras/utils"
import { $IDBBuilder } from "#structure/builder/$IDBBuilder"

declare module '@amateras/core' {
    export namespace $ {
        /**
         * Create {@link $IDBBuilder} with IDB name and version number.
         * @param name - Database name
         * @param version - Version number
         */
        export function idb<N extends string, V extends number>(name: N, version: V): $IDBBuilder<{name: N, version: V, stores: {}}>;
    }
}

_Object_assign($, {
    idb: (name: string, version: number) => new $IDBBuilder({name, version, stores: {}})
})