import { $IDB, type $IDBConfig } from "#structure/$IDB";
import { _Array_from, _instanceof, _null, _Object_assign, _Object_fromEntries, _Promise, forEach, isFunction } from "amateras/lib/native";
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
    constructor(config: Config) {
        _Object_assign(this, config);
    }

    deleteUnused(enable: boolean) {
        this.#deleteUnused = enable;
        return this;
    }

    store<N extends string, B extends $IDBStoreBuilderFunction>(name: N, builder: B): $IDBBuilder<Prettify<Config & { stores: Config['stores'] & Prettify<Record<N, ReturnType<B>['config']>> }>>
    store<N extends string, B extends $IDBStoreBuilder<any>>(name: N, builder: B): $IDBBuilder<Prettify<Config & { stores: Config['stores'] & Prettify<Record<N, B['config']>> }>>
    store(name: string, builder: $IDBStoreBuilderFunction | $IDBStoreBuilder)
    {
        this.storeMap.set(name, isFunction(builder) ? builder(new $IDBStoreBuilder({autoIncrement: false, keyPath: null, indexes: {}, name, schema: null})) : builder);
        return this as any;
    }

    async open(): Promise<$IDB<Config>> {
        return new _Promise<$IDB>((resolve, reject) => {
            const {version: dbVersion, name: dbName, storeMap} = this;
            const initDBRequest = _indexedDB.open(dbName);
            const createStoresMap = new Map<string, $IDBStoreBuilder>();
            const createIndexMap = new Map<$IDBStoreBuilder, Map<string, $IDBIndexConfig>>();
            const upgradeStoreMap = new Map<string, $IDBStoreBuilder>();
            const cachedObjectMap = new Map<string, {key: any, value: any}[]>();
            const unusedStoreNameList: string[] = [];
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
                console.debug('Initial Create DB')
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
                console.debug('Initial Open DB');
                const idb = initDBRequest.result;
                const $idb = new $IDB(idb, idbConfig);
                const transaction = idb[objectStoreNames].length ?  idb.transaction(_Array_from(idb[objectStoreNames]), 'readonly') : null;
                if (idb.version === dbVersion) return resolve($idb);
                // get unused stores
                transaction && forEach(_Array_from(transaction[objectStoreNames]), name => storeMap.has(name) && unusedStoreNameList.push(name))
                // check store config matches
                forEach(storeMap, (storeBuilder, storeName) => {
                    const {keyPath, autoIncrement} = storeBuilder.config;
                    const indexMap = new Map();
                    const checkIndexes = () =>
                        forEach(storeBuilder.indexes, (indexBuilder, indexName) => {
                            const [index] = trycatch(() => store?.index(indexName));
                            const CONFIG_CHANGED = `${indexBuilder.keyPath}` !== `${index?.keyPath}` 
                                && !!indexBuilder.multiEntry !== index?.multiEntry 
                                && !!indexBuilder.unique !== index?.unique;
                            if (!index || CONFIG_CHANGED) {
                                indexMap.set(indexName, indexBuilder);
                                createIndexMap.set(storeBuilder, indexMap);
                            }
                        })
                    // get store from idb
                    const [store] = trycatch(() => transaction?.objectStore(storeName));
                    if (!store) return createStoresMap.set(storeName, storeBuilder), checkIndexes();
                    // create store and break if idb have no record
                    // define matches variables
                    // const UNDEFINED_CONFIG = [keyPath, autoIncrement, ]
                    //     isUndefined(keyPath) && isUndefined(autoIncrement) 
                    //     && isUndefined(currentStore.keyPath) && isUndefined(currentStore.autoIncrement);
                    const OBJECT_UPGRADE = _Array_from(storeBuilder.upgrades).find(([upgradeVersion],) => 
                        dbVersion >= upgradeVersion && idb.version < upgradeVersion
                    )
                    const CONFIG_CHANGED = 
                        `${keyPath}` !== `${store?.keyPath}` 
                        || autoIncrement !== store?.autoIncrement
                    const UPGRADE_NEEDED = OBJECT_UPGRADE || CONFIG_CHANGED;
                    console.debug(CONFIG_CHANGED)
                    // add indexes
                    checkIndexes();
                    // store existed and not need upgrade
                    if (store && !UPGRADE_NEEDED) return;
                    // add upgrade store queue
                    upgradeStoreMap.set(storeName, storeBuilder)
                    
                })
                // resolve if no need upgrade
                if (dbVersion === idb.version && !createStoresMap.size 
                    && !upgradeStoreMap.size && !unusedStoreNameList.length && !createIndexMap.size)
                    return resolve($idb);
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
                upgradeDBRequest[onsuccess] = _ => resolve(new $IDB(upgradeDBRequest.result, idbConfig))
            }

            /** IndexedDB upgrade version */
            const upgradeStore = (req: IDBOpenDBRequest) => {
                console.debug('Upgrade DB')
                const idb = req.result;
                /** 'versionchange' type transaction */
                const transaction = req.transaction as IDBTransaction;
                // create stores
                forEach(createStoresMap, ({config}, name) => idb[createObjectStore](name, config));
                // upgrade stores
                forEach(upgradeStoreMap, ({config}, name) => {
                    idb[deleteObjectStore](name); 
                    idb[createObjectStore](name, config);
                })
                // create indexes
                forEach(createIndexMap, (indexMap, {config: {name}}) => {
                    const store = transaction.objectStore(name);
                    forEach(indexMap, ({keyPath, ...config}, name) => {
                        // if indexes existed, delete and create again
                        if (store.indexNames.contains(name)) store.deleteIndex(name);
                        store.createIndex(name, keyPath, config)
                    })
                })
                // delete unused stores
                if (this.#deleteUnused) forEach(unusedStoreNameList, idb[deleteObjectStore]);
                // open db again for insert objects
                forEach(cachedObjectMap, (objectList, storeName) => {
                    const store = transaction.objectStore(storeName);
                    forEach(objectList, ({key, value}) => {
                        if (store.autoIncrement || store.keyPath) store.add(value);
                        else store.add(value, key)
                    })
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