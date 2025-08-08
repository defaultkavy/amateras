import type { $IDB } from "#structure/$IDB";
import { _null } from "amateras/lib/native";
import type { $IDBStoreConfig } from "#structure/$IDBStore";
import type { $IDBIndexConfig } from "#structure/$IDBIndex";

export class $IDBStoreBuilder<Config extends $IDBStoreConfig = { name: string, keyPath: null, autoIncrement: false, schema: any, indexes: {} }> {
    readonly config: Config
    upgrades = new Map<number, $IDBStoreUpgradeFunction>();
    indexes = new Map<string, $IDBIndexConfig>();
    constructor(config: Config) {
        this.config = config;
    }

    keyPath<K extends string[]>(...keyPath: K): $IDBStoreBuilder<Prettify<Omit<Config, 'keyPath'> & { keyPath: K }>>;
    keyPath<K extends string>(keyPath: K): $IDBStoreBuilder<Prettify<Omit<Config, 'keyPath'> & { keyPath: K }>>;
    keyPath(...keyPath: string[]) {
        this.config.keyPath = keyPath;
        return this as any;
    }

    autoIncrement<K extends boolean>(keypath: K): $IDBStoreBuilder<Prettify<Omit<Config, 'autoIncrement'> & { autoIncrement: K }>>;
    autoIncrement(enable: boolean) {
        this.config.autoIncrement = enable;
        return this as any;
    }

    schema<T extends $IDBStoreBuilderSchema<Config>>(): $IDBStoreBuilder<Prettify<Omit<Config, 'schema'> & { schema: T }>>;
    schema() { return this as any }

    index<N extends string, C extends $IDBIndexOptionalConfig<Config>>(name: N, config: C): $IDBStoreBuilder<Prettify<Config & { indexes: Config['indexes'] & Prettify<Record<N, Prettify<$IDBIndexOptionalHandle<N, C>>>> }>>
    index<C extends $IDBIndexConfig>(name: string, config: C) {
        this.indexes.set(name, {
            ...config, name,
            multiEntry: config.multiEntry ?? false,
            unique: config.unique ?? false
        });
        return this as any;
    }

    upgrade(version: number, handle: $IDBStoreUpgradeFunction) {
        this.upgrades.set(version, handle);
        return this;
    }

}

export type $IDBStoreUpgradeFunction = (objects: {key: IDBValidKey, value: any}[], idb: $IDB<any>) => OrPromise<{key: IDBValidKey, value: any}[]>;
export type $IDBIndexOptionalConfig<StoreConfig extends $IDBStoreConfig = any> = { keyPath: OrArray<keyof StoreConfig['schema']>, unique?: boolean, multiEntry?: boolean }
type $IDBIndexOptionalHandle<N extends string, Config extends $IDBIndexOptionalConfig> = {
    name: N;
    keyPath: Config['keyPath'];
    multiEntry: Config['multiEntry'] extends boolean ? Config['multiEntry'] : false;
    unique: Config['unique'] extends boolean ? Config['unique'] : false;
}

type $IDBStoreBuilderSchema<Config extends $IDBStoreConfig> = 
    Config['keyPath'] extends string
        ? { [key in Config['keyPath']]: IDBValidKey } 
        : Config['keyPath'] extends string
            ? { [key in Config['keyPath'][number]]: IDBValidKey }
            : any;