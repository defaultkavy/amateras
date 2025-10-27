import { _Array_from, _Object_assign, forEach } from "@amateras/utils";
import type { $IDB } from "./$IDB";
import { $IDBStore, type $IDBStoreConfig } from "./$IDBStore";

export interface $IDBTransaction {}
export class $IDBTransaction<Config extends $IDBTransactionConfig = any> {
    #transaction: IDBTransaction;
    #$idb: $IDB
    readonly writable: boolean;
    readonly stores: Config['stores'] = {};
    readonly durability: string;
    constructor($idb: $IDB, transaction: IDBTransaction) {
        this.#transaction = transaction;
        this.#$idb = $idb;
        this.writable = transaction.mode !== 'readonly';
        this.durability = transaction.durability;
        forEach(_Array_from(transaction.objectStoreNames), name => {
            _Object_assign(this.stores, { [name]: $idb.stores[name] })
        })
    }

    store<N extends keyof Config['stores'] & string>(name: N): $IDBStore<Config['stores'][N]>
    store(name: string) {
        return new $IDBStore(this.#transaction.objectStore(name), this.#$idb.stores[name]);
    }

    commit() {
        return this.#transaction.commit();
    }

    abort() {
        return this.#transaction.abort();
    }
}

export type $IDBTransactionConfig = {
    stores: { [key: string]: $IDBStoreConfig }
}