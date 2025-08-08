import { $IDB, type $IDBConfig } from "#structure/$IDB";
import { _Array_from, _instanceof, _JSON_stringify, _null, _Object_assign, _Object_fromEntries, _Promise, forEach, isFunction } from "amateras/lib/native";
import { $IDBStoreBuilder } from "./$IDBStoreBuilder";
import type { $IDBIndexConfig } from "#structure/$IDBIndex";
import type { $IDBStoreConfig } from "#structure/$IDBStore";
import { trycatch } from "amateras/lib/trycatch";
// optimizer variables
const objectStoreNames = 'objectStoreNames';
const deleteObjectStore = 'deleteObjectStore';
const createObjectStore = 'createObjectStore';
const _indexedDB = indexedDB;
const onupgradeneeded = 'onupgradeneeded';
const onsuccess = 'onsuccess';

export interface $IDBBuilder {
    readonly name: string;
    readonly version: number;
}
export class $IDBBuilder<Config extends $IDBConfig = { name: string, stores: {}, version: number }> {
    #deleteUnused = false;
    storeMap = new Map<string, $IDBStoreBuilder>();
    #devMode: boolean = false;
    constructor(config: Config) {
        _Object_assign(this, config);
    }

    /**
     * This option helping developer to debug when initializing.
     * @param dev - Enable dev mode
     */
    devMode(dev: boolean) {
        this.#devMode = dev;
        return this;
    }
    
    /**
     * If set to true, unused store will be deleted when initialize.
     * @param enable - Enable delete unused stores
     */
    deleteUnused(enable: boolean) {
        this.#deleteUnused = enable;
        return this;
    }

    /**
     * Add new store to builder.
     * @param name - Store name
     * @param builder - Store builder or builder function
     */
    store<N extends string, B extends $IDBStoreBuilderFunction>(name: N, builder: B): $IDBBuilder<Prettify<Config & { stores: Config['stores'] & Prettify<Record<N, ReturnType<B>['config']>> }>>
    store<N extends string, B extends $IDBStoreBuilder<any>>(name: N, builder: B): $IDBBuilder<Prettify<Config & { stores: Config['stores'] & Prettify<Record<N, B['config']>> }>>
    store(name: string, builder: $IDBStoreBuilderFunction | $IDBStoreBuilder)
    {
        this.storeMap.set(name, isFunction(builder) ? builder(new $IDBStoreBuilder({autoIncrement: false, keyPath: null, indexes: {}, name, schema: null})) : builder);
        return this as any;
    }

    /**
     * Open IDB and initialize, create new IDB if the name of IDB is not exists, or perform the upgrade if version number change.
     */
    async open(): Promise<$IDB<Config>> {
        return new _Promise<$IDB>((resolve, reject) => {
            const {version: dbVersion, name: dbName, storeMap} = this;
            const initDBRequest = _indexedDB.open(dbName);
            const createStoresMap = new Map<string, $IDBStoreBuilder<$IDBStoreConfig>>();
            const createIndexMap = new Map<$IDBStoreBuilder, Map<string, $IDBIndexConfig>>();
            const upgradeStoreMap = new Map<string, $IDBStoreBuilder<$IDBStoreConfig>>();
            const cachedObjectMap = new Map<string, {key: any, value: any}[]>();
            const unusedStoreNameList: string[] = [];
            const debug = (message: string) => this.#devMode && console.debug(`[$IDBBuilder (${dbName})]`, message);
            const storesObject: $IDBConfig['stores'] = _Object_fromEntries(_Array_from(storeMap).map(([name, {config: {keyPath, autoIncrement}, indexes}]) => [
                name, 
                {
                    autoIncrement, keyPath, name,
                    schema: _null,
                    indexes: _Object_fromEntries(_Array_from(indexes).map(([name, {keyPath, multiEntry, unique}]) => [
                        name,
                        { keyPath, multiEntry, unique } as $IDBIndexConfig
                    ]))
                } as $IDBStoreConfig
            ]))
            const idbConfig = { version: dbVersion, name: dbName, stores: storesObject };
            /** IndexedDB initial create function */
            const initialCreateDB = () => {
                debug(`No IDB detected, create IDB`);
                const {transaction, result: idb} = initDBRequest;
                forEach(storeMap, (storeBuilder, name) => {
                    createStoresMap.set(name, storeBuilder);
                    createIndexMap.set(storeBuilder, new Map(storeBuilder.indexes))
                })
                if (idb.version === dbVersion) upgradeStore(initDBRequest);
                else transaction!.oncomplete = _ => {
                    const upgradeDBRequest = indexedDB.open(dbName, dbVersion);
                    upgradeDBRequest.onupgradeneeded = _ => upgradeStore(upgradeDBRequest);
                }
            }
            /** IndexedDB initial open function */
            const initialOpenDB = async () => {
                debug(`IDB Detected`);
                const idb = initDBRequest.result;
                const $idb = new $IDB(idb, idbConfig);
                const transaction = idb[objectStoreNames].length ?  idb.transaction(_Array_from(idb[objectStoreNames]), 'readonly') : null;
                const noUpgrade = () => {
                    debug(`No Upgrade`);
                    resolve($idb);
                }
                if (idb.version === dbVersion) return noUpgrade();
                // get unused stores
                transaction && forEach(_Array_from(transaction[objectStoreNames]), name => storeMap.has(name) && unusedStoreNameList.push(name))
                // check store config matches
                forEach(storeMap, (storeBuilder, storeName) => {
                    const {keyPath, autoIncrement} = storeBuilder.config;
                    const indexMap = new Map();
                    const checkIndexes = () =>
                        forEach(storeBuilder.indexes, (indexBuilder, indexName) => {
                            const [index] = trycatch(() => store?.index(indexName));
                            const CONFIG_CHANGED = _JSON_stringify(indexBuilder.keyPath) !== _JSON_stringify(index?.keyPath)
                                || !!indexBuilder.multiEntry !== index?.multiEntry 
                                || !!indexBuilder.unique !== index?.unique;
                            if (!index || CONFIG_CHANGED) {
                                indexMap.set(indexName, indexBuilder);
                                createIndexMap.set(storeBuilder, indexMap);
                            }
                        })
                    // get store from idb
                    const [store] = trycatch(() => transaction?.objectStore(storeName));
                    // create store and break if idb have no store exist
                    if (!store) return createStoresMap.set(storeName, storeBuilder), checkIndexes();
                    // define matches variables
                    const OBJECT_UPGRADE = _Array_from(storeBuilder.upgrades).find(([upgradeVersion],) => 
                        dbVersion >= upgradeVersion && idb.version < upgradeVersion
                    )
                    const CONFIG_CHANGED = 
                        _JSON_stringify(keyPath) !== _JSON_stringify(store.keyPath)
                        || autoIncrement !== store?.autoIncrement
                    const UPGRADE_NEEDED = OBJECT_UPGRADE || CONFIG_CHANGED;
                    // add indexes
                    checkIndexes();
                    // store existed and not need upgrade
                    if (store && !UPGRADE_NEEDED) return;
                    // add upgrade store queue
                    upgradeStoreMap.set(storeName, storeBuilder)
                    
                })
                // resolve if no need upgrade
                if (dbVersion === idb.version && !createStoresMap.size && !upgradeStoreMap.size && !unusedStoreNameList.length && !createIndexMap.size)
                    return noUpgrade();
                // cache objects
                for (const [storeName, storeBuilder] of upgradeStoreMap) {
                    const cache: {key: any, value: any}[] = [];
                    // filter version lower than current idb
                    const upgradeHandleList = _Array_from(storeBuilder.upgrades)
                        .filter(([upgradeVersion]) => dbVersion >= upgradeVersion && idb.version < upgradeVersion )
                        .sort((a, b) => a[0] - b[0])
                        .map(config => config[1]);
                    // cache objects from store
                    await $idb.transaction(storeName, false, async $tx => {
                        cachedObjectMap.set(storeName, cache);
                        await $tx.store(storeName).cursor(async cursor => {
                            cache.push({key: cursor.key, value: cursor.value});
                            cursor.continue();
                        })
                    })
                    // upgrade objects
                    for (const upgradeHandle of upgradeHandleList) 
                        cachedObjectMap.set(storeName, await upgradeHandle(cache, $idb));
                }
                // upgrade db from lower version
                idb.close();
                const upgradeDBRequest = _indexedDB.open(dbName, dbVersion);
                upgradeDBRequest[onupgradeneeded] = _ => upgradeStore(upgradeDBRequest);
                upgradeDBRequest[onsuccess] = _ => {
                    debug('IDB Upgrade Completed');
                    resolve(new $IDB(upgradeDBRequest.result, idbConfig));
                }
            }

            /** IndexedDB upgrade version */
            const upgradeStore = (req: IDBOpenDBRequest) => {
                debug('Upgrade DB')
                const idb = req.result;
                /** 'versionchange' type transaction */
                const transaction = req.transaction as IDBTransaction;
                // create stores
                forEach(createStoresMap, ({config}, name) => {
                    idb[createObjectStore](name, config);
                    debug(`Store Created: ${name}`);
                });
                // upgrade stores
                forEach(upgradeStoreMap, ({config}, name) => {
                    idb[deleteObjectStore](name); 
                    idb[createObjectStore](name, config);
                    debug(`Store Upgraded: ${name}`);
                })
                // create indexes
                forEach(createIndexMap, (indexMap, {config: {name}}) => {
                    const store = transaction.objectStore(name);
                    forEach(indexMap, ({keyPath, ...config}, indexName) => {
                        // if indexes existed, delete and create again
                        if (store.indexNames.contains(indexName)) store.deleteIndex(indexName);
                        store.createIndex(indexName, keyPath, config);
                        debug(`Store '${name}' Index Created: ${indexName}`);
                    })
                })
                // delete unused stores
                if (this.#deleteUnused) forEach(unusedStoreNameList, name => {
                    idb[deleteObjectStore](name);
                    debug(`Unused Store Deleted: ${name}`);
                });
                // open db again for insert objects
                forEach(cachedObjectMap, (objectList, storeName) => {
                    const store = transaction.objectStore(storeName);
                    forEach(objectList, ({key, value}) => {
                        if (store.autoIncrement || store.keyPath) store.add(value);
                        else store.add(value, key)
                    })
                    debug(`Recovered Store Objects: ${objectList.length} objects of store '${storeName}'`);
                })
            }

            // If db not exist, create db will trigger upgraedneeded event
            initDBRequest[onupgradeneeded] = initialCreateDB;
            // If db exist, trigger success event
            initDBRequest[onsuccess] = initialOpenDB;
            initDBRequest.onerror = _ => reject(initDBRequest.error);
        })
    }
}

export type $IDBStoreBuilderFunction = (store: $IDBStoreBuilder) => $IDBStoreBuilder<any>;