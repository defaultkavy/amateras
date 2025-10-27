import { _Object_assign } from "@amateras/utils";
import type { $IDBStore, $IDBStoreConfig, QueryMultipleKeyPath } from "./$IDBStore";
import { $IDBStoreBase } from "./$IDBStoreBase";
import type { $IDBCursor } from "./$IDBCursor";

export class $IDBIndex<StoreConfig extends $IDBStoreConfig = any, Config extends $IDBIndexConfig = any> extends $IDBStoreBase{
    readonly store: $IDBStore;
    constructor(store: $IDBStore, index: IDBIndex, config: Config) {
        super(index);
        this.store = store;
        _Object_assign(this, config);
    }
}

export interface $IDBIndex<StoreConfig extends $IDBStoreConfig, Config extends $IDBIndexConfig = any> {
    readonly unique: Config['unique'];
    readonly multiEntry: Config['multiEntry'];
    readonly keyPath: Config['keyPath'];
    
    /** {@link IDBIndex.cursor} */
    cursor(handle: (cursor: $IDBCursor) => void, query?: IDBValidKey | IDBKeyRange | null, direction?: IDBCursorDirection): Promise<null>

    /** {@link IDBIndex.keyCursor} */
    keyCursor(handle: (cursor: $IDBCursor) => void, query?: IDBValidKey | IDBKeyRange | null, direction?: IDBCursorDirection): Promise<null>

    /** {@link IDBIndex.count} */
    count(query?: $IDBIndexKey<StoreConfig, Config> | IDBKeyRange): Promise<number>;

    /** {@link IDBIndex.get} */
    get(query: $IDBIndexKey<StoreConfig, Config> | IDBKeyRange): Promise<StoreConfig['schema']>

    /** {@link IDBIndex.getAll} */
    getAll(query?: $IDBIndexKey<StoreConfig, Config> | IDBKeyRange): Promise<StoreConfig['schema'][]>
}

export type $IDBIndexConfig = {
    unique: boolean;
    multiEntry: boolean;
    keyPath: string | string[];
    name: string;
}

export type $IDBIndexKey<StoreConfig extends $IDBStoreConfig, Config extends $IDBIndexConfig> = 
    Config['keyPath'] extends string
    ?   StoreConfig['schema'][Config['keyPath']]
    :   Config['keyPath'] extends string[]
        ?   QueryMultipleKeyPath<Config['keyPath'], StoreConfig>
        :   IDBValidKey;