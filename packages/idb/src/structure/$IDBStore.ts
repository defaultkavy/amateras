import { _instanceof, _Object_assign, _Promise } from "@amateras/utils";
import { $IDBIndex, type $IDBIndexConfig } from "./$IDBIndex";
import { $IDBRequest } from "#lib/$IDBRequest";
import { $IDBStoreBase } from "./$IDBStoreBase";
import type { $IDBCursor } from "./$IDBCursor";

export class $IDBStore<Config extends $IDBStoreConfig = any> extends $IDBStoreBase {
    #store: IDBObjectStore;
    constructor(store: IDBObjectStore, config: Config) {
        super(store);
        this.#store = store;
        _Object_assign(this, config);
    }

    /** {@link IDBObjectStore.put} */
    put<V extends $IDBStoreValueResolver<Config>>(...value: V): Promise<$IDBStoreKey<Config>>
    put(value: any, key?: any) {
        return $IDBRequest(this.#store.put(value, key));
    }

    /** {@link IDBObjectStore.add} */
    add<V extends $IDBStoreValueResolver<Config>>(value: V): Promise<$IDBStoreKey<Config>>
    add(value: any, key?: any) {
        return $IDBRequest(this.#store.add(value, key));
    }

    /** {@link IDBObjectStore.delete} */
    delete(query: $IDBStoreKey<Config> | IDBKeyRange): Promise<undefined>;
    delete(query: IDBValidKey | IDBKeyRange) {
        return $IDBRequest(this.#store.delete(query));
    }

    /** {@link IDBObjectStore.clear} */
    clear() {
        return $IDBRequest(this.#store.clear())
    }

    /** Get and return {@link $IDBIndex} */
    index<K extends keyof Config['indexes'] & string>(name: K): $IDBIndex<Config, Config['indexes'][K]>
    index(name: keyof Config['indexes'] & string) {
        return new $IDBIndex(this, this.#store.index(name), this.indexes[name]!)
    }
}

export interface $IDBStore<Config extends $IDBStoreConfig = any> {
    readonly name: Config['name'];
    readonly indexes: Config['indexes'];
    readonly schema: Config['schema'];
    readonly keyPath: Config['keyPath'];
    readonly autoIncrement: Config['autoIncrement'];

    /** {@link IDBObjectStore.cursor} */
    cursor(handle: (cursor: $IDBCursor) => void, query?: IDBValidKey | IDBKeyRange | null, direction?: IDBCursorDirection): Promise<null>

    /** {@link IDBObjectStore.keyCursor} */
    keyCursor(handle: (cursor: $IDBCursor) => void, query?: IDBValidKey | IDBKeyRange | null, direction?: IDBCursorDirection): Promise<null>

    /** {@link IDBObjectStore.count} */
    count(query?: $IDBStoreKey<Config> | IDBKeyRange): Promise<number>;

    /** {@link IDBObjectStore.get} */
    get(query: $IDBStoreKey<Config> | IDBKeyRange): Promise<Config['schema']>

    /** {@link IDBObjectStore.getAll} */
    getAll(query?: $IDBStoreKey<Config> | IDBKeyRange): Promise<Config['schema'][]>
}

export type $IDBStoreConfig = {
    name: string;
    indexes: { [key: string]: $IDBIndexConfig };
    schema: any;
    keyPath: string | string[] | null;
    autoIncrement: boolean;
}

export type $IDBStoreValueResolver<Config extends $IDBStoreConfig> = 
Config['keyPath'] extends string
    ?   Config['autoIncrement'] extends true
        ?   [Omit<Config['schema'], Config['keyPath']> & {[key in Config['keyPath']]?: Config['schema'][key]}]
        :   [Config['schema']]
    :   Config['keyPath'] extends string[]
        ?   [Config['schema']] 
        :   Config['autoIncrement'] extends true 
            ?   [Config['schema']] 
            :   [Config['schema'], IDBValidKey];

export type $IDBStoreKey<Config extends $IDBStoreConfig> = 
    Config['keyPath'] extends string
        ?   Config['schema'][Config['keyPath']]
        :   Config['keyPath'] extends string[]
            ?   QueryMultipleKeyPath<Config['keyPath'], Config>
            :   Config['autoIncrement'] extends true
                ?   number
                :   IDBValidKey;

export type QueryMultipleKeyPath<T extends string[], Config extends { schema: {} }> = 
    T extends [infer A, ...infer Rest]
    ?   A extends keyof Config['schema']
        ?   Rest extends string[]
            ?   [Config['schema'][A], ...QueryMultipleKeyPath<Rest, Config>]
            :   [Config['schema'][A]]
        :   never
    : []