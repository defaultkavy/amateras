import { _Object_assign } from "amateras/lib/native";
import type { $IDBStore, $IDBStoreConfig } from "./$IDBStore";
import { $IDBStoreBase } from "./$IDBStoreBase";

export interface $IDBIndex<StoreConfig extends $IDBStoreConfig, Config extends $IDBIndexConfig = any> {
    readonly unique: Config['unique'];
    readonly multiEntry: Config['multiEntry'];
    readonly keyPath: Config['keyPath'];
}
export class $IDBIndex<StoreConfig extends $IDBStoreConfig = any, Config extends $IDBIndexConfig = any> extends $IDBStoreBase<StoreConfig> {
    readonly store: $IDBStore;
    constructor(store: $IDBStore, index: IDBIndex, config: Config) {
        super(index);
        this.store = store;
        _Object_assign(this, config);
    }
}

export type $IDBIndexConfig = {
    unique: boolean;
    multiEntry: boolean;
    keyPath: string;
    name: string;
}