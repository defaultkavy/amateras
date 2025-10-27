import { _Array_from, _null, _Object_assign, _Object_fromEntries, _Promise, isBoolean } from "@amateras/utils";
import { $IDBStore, type $IDBStoreConfig } from "./$IDBStore";
import { $IDBTransaction } from "./$IDBTransaction";

export interface $IDB<Config extends $IDBConfig = any> {
    /** Object with store name key and `$IDBStoreConfig` value. */
    readonly stores: Config['stores'];
}
export class $IDB<Config extends $IDBConfig = any> {
    /** {@link IDBDatabase} instance. */
    readonly idb: IDBDatabase;
    /** IndexedDB database name. */
    readonly name: Config['name'];
    /** IndexedDB database version. */
    readonly version: Config['version'];
    constructor(idb: IDBDatabase, config: Omit<Config, 'name' | 'version'>) {
        this.idb = idb;
        this.name = idb.name;
        this.version = idb.version;
        _Object_assign(this, config);
    }

    /**
     * Create new transaction with the store name, you can directly operating the target store with `handle` function. This method will return a `Promise` with the `handle` return type value.
     * @param name - Store name
     * @param writable - Enable readwrite mode
     * @param handle - Function execute on transaction opened
     * @returns The handle function return type
     */
    async store<K extends keyof Config['stores'] & string, T>(name: K, handle: (store: $IDBStore<Config['stores'][K]>) => T): Promise<T>
    async store<K extends keyof Config['stores'] & string, T>(name: K, writable: boolean, handle: (store: $IDBStore<Config['stores'][K]>) => T): Promise<T>
    async store<K extends keyof Config['stores'] & string, T>(name: K, resolver: boolean | Function, handle?: Function) {
        if (isBoolean(resolver)) return this.transaction(name, resolver, $tx => handle!($tx.store(name)));
        else return this.transaction(name, $tx => resolver($tx.store(name)))
    }

    /** 
     * Create new transaction with the store name, you can pass multiple store name into `storeName` argument for operating multiple store in one transaction.
     * @param store - Store name, allow string array
     * @param writable - Enable readwrite mode
     * @param handle - Function execute on transaction opened
     * @returns The handle function return type
     */
    async transaction<K extends keyof Config['stores'] & string, T>(store: K | K[], handle: (transaction: $IDBTransaction<{ stores: Pick<Config['stores'], K> }>) => T): Promise<T>
    async transaction<K extends keyof Config['stores'] & string, T>(store: K | K[], writable: boolean, handle: (transaction: $IDBTransaction<{ stores: Pick<Config['stores'], K> }>) => T): Promise<T>
    async transaction<K extends keyof Config['stores'] & string, T>(store: K | K[], resolver?: boolean | Function, handle?: Function) {
        handle = isBoolean(resolver) ? handle : resolver;
        resolver = isBoolean(resolver) ? resolver : false;
        const tx = this.idb.transaction(store, resolver ? 'readwrite' : 'readonly');
        const $tx = new $IDBTransaction(this, tx);
        const result = handle!($tx);
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