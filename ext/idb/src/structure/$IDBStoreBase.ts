import { _Array_from, _instanceof, _null, _Promise } from "amateras/lib/native";
import { $IDBRequest } from "#lib/$IDBRequest";
import { $IDBCursor } from "./$IDBCursor";
import type { $IDBStoreConfig, $IDBStoreKey } from "./$IDBStore";

export abstract class $IDBStoreBase<Config extends $IDBStoreConfig> {
    readonly #instance;
    constructor(instance: IDBObjectStore | IDBIndex) {
        this.#instance = instance;
    }

    cursor(handle: (cursor: $IDBCursor) => void, query?: IDBValidKey | IDBKeyRange | null, direction?: IDBCursorDirection): Promise<null>
    cursor(handle: (cursor: $IDBCursor) => void, query?: IDBValidKey | IDBKeyRange | null, direction?: IDBCursorDirection) {
        return $IDBRequest(this.#instance.openCursor(query, direction), (req , resolve) => req.result ? handle(new $IDBCursor(this, req.result)) : resolve(null))
    }

    keyCursor(handle: (cursor: $IDBCursor) => void, query?: IDBValidKey | IDBKeyRange | null, direction?: IDBCursorDirection): Promise<null>
    keyCursor(handle: (cursor: $IDBCursor) => void, query?: IDBValidKey | IDBKeyRange | null, direction?: IDBCursorDirection) {
        return $IDBRequest(this.#instance.openCursor(query, direction), (req , resolve) => req.result ? handle(new $IDBCursor(this, req.result)) : resolve(null))
    }

    count(query: $IDBStoreKey<Config> | IDBKeyRange): Promise<number>;
    count(query?: IDBValidKey | IDBKeyRange) {
        return $IDBRequest(this.#instance.count(query));
    }

    get(query: $IDBStoreKey<Config> | IDBKeyRange): Promise<Config['schema']>
    get(query: IDBValidKey | IDBKeyRange) {
        return $IDBRequest(this.#instance.get(query))
    }

    getAll(query: $IDBStoreKey<Config> | IDBKeyRange): Promise<Config['schema'][]>
    getAll(query: IDBValidKey | IDBKeyRange) {
        return $IDBRequest(this.#instance.getAll(query))
    }
}