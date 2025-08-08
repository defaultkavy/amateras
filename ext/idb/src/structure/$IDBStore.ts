import { _instanceof, _Object_assign, _Promise } from "amateras/lib/native";
import { $IDBIndex, type $IDBIndexConfig } from "./$IDBIndex";
import { $IDBRequest } from "#lib/utils";
import { $IDBStoreBase } from "./$IDBStoreBase";

export interface $IDBStore<Config extends $IDBStoreConfig = any> {
    readonly name: Config['name'];
    readonly indexes: Config['indexes'];
    readonly schema: Config['schema'];
    readonly keyPath: Config['keyPath'];
    readonly autoIncrement: Config['autoIncrement'];
}
export class $IDBStore<Config extends $IDBStoreConfig = any> extends $IDBStoreBase<Config> {
    #store: IDBObjectStore;
    constructor(store: IDBObjectStore, config: Config) {
        super(store);
        this.#store = store;
        _Object_assign(this, config);
    }

    put<V extends $IDBStoreKeyValueResolver<Config>>(value: V, key: IDBValidKey): Promise<IDBValidKey>
    put<V extends $IDBStoreValueResolver<Config>>(value: V): Promise<IDBValidKey>
    put(value: any, key?: any) {
        return $IDBRequest(this.#store.put(value, key));
    }

    add<V extends $IDBStoreKeyValueResolver<Config>>(value: V, key: IDBValidKey): Promise<IDBValidKey>
    add<V extends $IDBStoreValueResolver<Config>>(value: V): Promise<IDBValidKey>
    add(value: any, key?: any) {
        return $IDBRequest(this.#store.add(value, key));
    }

    delete(query: $IDBStoreKey<Config> | IDBKeyRange): Promise<undefined>;
    delete(query: IDBValidKey | IDBKeyRange) {
        return $IDBRequest(this.#store.delete(query));
    }

    clear() {
        return $IDBRequest(this.#store.clear())
    }

    index(name: keyof Config['indexes'] & string) {
        return new $IDBIndex(this, this.#store.index(name), this.indexes[name]!)
    }
}

export type $IDBStoreConfig = {
    name: string;
    indexes: { [key: string]: $IDBIndexConfig };
    schema: any;
    keyPath: string | string[] | null;
    autoIncrement: boolean;
}

export type $IDBStoreKeyValueResolver<Config extends $IDBStoreConfig> = Config['keyPath'] extends null ? Config['autoIncrement'] extends false ? Config['schema'] : never : never;
export type $IDBStoreValueResolver<Config extends $IDBStoreConfig> = Config['keyPath'] extends (string | string[]) ? Config['schema'] : Config['autoIncrement'] extends true ? Config['schema'] : never;

export type $IDBStoreKey<Config extends $IDBStoreConfig> = 
    Config['keyPath'] extends string
        ?   Config['schema'][Config['keyPath']]
        :   Config['keyPath'] extends string[]
            ?   QueryArray<Config['keyPath'], Config>
            :   Config['autoIncrement'] extends true
                ?   number
                :   IDBValidKey;

type QueryArray<T extends string[], Config extends { schema: {} }> = 
    T extends [infer A, ...infer Rest]
    ?   A extends keyof Config['schema']
        ?   Rest extends string[]
            ?   [Config['schema'][A], ...QueryArray<Rest, Config>]
            :   [Config['schema'][A]]
        :   never
    : []