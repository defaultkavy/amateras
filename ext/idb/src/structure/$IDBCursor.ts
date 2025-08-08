import { _instanceof, _Object_assign, _Promise } from "amateras/lib/native";
import { $IDBRequest } from "#lib/utils";
import { $IDBStore, type $IDBStoreConfig } from "./$IDBStore";
import { $IDBIndex } from "./$IDBIndex";
import type { $IDBStoreBase } from "./$IDBStoreBase";

export interface $IDBCursor {}
export class $IDBCursor<StoreConfig extends $IDBStoreConfig = any> {
    #cursor: IDBCursorWithValue;
    readonly store: $IDBStore<StoreConfig>;
    readonly direction;
    constructor(store: $IDBStoreBase<StoreConfig>, cursor: IDBCursorWithValue) {
        this.#cursor = cursor;
        this.store = _instanceof(store, $IDBIndex<StoreConfig>) ? store.store : store as $IDBStore;
        this.direction = cursor.direction;
    }

    get value() { return this.#cursor.value }
    get key() { return this.#cursor.key }
    get primaryKey() { return this.#cursor.primaryKey }

    async update<T>(value: T) {
        return $IDBRequest(this.#cursor.update(value))
    }

    async delete() {
        return $IDBRequest(this.#cursor.delete())
    }

    continue(key?: IDBValidKey) { this.#cursor.continue(key) }
    continuePrimaryKey(key: IDBValidKey, primaryKey: IDBValidKey) { this.#cursor.continuePrimaryKey(key, primaryKey) }
    advance(count: number) { this.#cursor.advance(count) }
    abort() { this.#cursor.request.transaction?.abort() }
}