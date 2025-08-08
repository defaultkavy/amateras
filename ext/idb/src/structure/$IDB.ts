import { _Array_from, _null, _Object_assign, _Object_fromEntries, _Promise } from "amateras/lib/native";
import { $IDBStore, type $IDBStoreConfig } from "./$IDBStore";
import { $IDBTransaction } from "./$IDBTransaction";

export interface $IDB<Config extends $IDBConfig = any> {
    readonly stores: Config['stores'];
}
export class $IDB<Config extends $IDBConfig = any> {
    readonly idb: IDBDatabase;
    readonly name: Config['name'];
    readonly version: Config['version'];
    constructor(idb: IDBDatabase, config: Omit<Config, 'name' | 'version'>) {
        this.idb = idb;
        this.name = idb.name;
        this.version = idb.version;
        _Object_assign(this, config);
    }

    async store<K extends keyof Config['stores'] & string, T>(name: K, writable: boolean, handle: (store: $IDBStore<Config['stores'][K]>) => T): Promise<T> {
        return this.transaction(name, writable, $tx => handle($tx.store(name)));
    }

    async transaction<K extends keyof Config['stores'] & string, T>(store: K | K[], writable: boolean, handle: (transaction: $IDBTransaction<{ stores: Pick<Config['stores'], K> }>) => T): Promise<T> {
        const tx = this.idb.transaction(store, writable ? 'readwrite' : 'readonly');
        const $tx = new $IDBTransaction(this, tx);
        const result = handle($tx);
        return new _Promise<T>((resolve, reject) => {
            tx.oncomplete = _ => resolve(result);
            tx.onerror = tx.onabort = _ => tx.error && reject(tx.error);
        })
    }
}

export type $IDBConfig = {
    name: string;
    version: number;
    stores: { [key: string]: $IDBStoreConfig }
}