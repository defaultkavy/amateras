import { _Array_from, _instanceof, _null, _Promise } from "@amateras/utils";
import { $IDBRequest } from "#lib/$IDBRequest";
import { $IDBCursor } from "./$IDBCursor";

export abstract class $IDBStoreBase {
    readonly #instance;
    constructor(instance: IDBObjectStore | IDBIndex) {
        this.#instance = instance;
    }

    cursor(handle: (cursor: $IDBCursor) => void, query?: IDBValidKey | IDBKeyRange | null, direction?: IDBCursorDirection) {
        return $IDBRequest(this.#instance.openCursor(query, direction), (req , resolve) => req.result ? handle(new $IDBCursor(this, req.result)) : resolve(null))
    }

    keyCursor(handle: (cursor: $IDBCursor) => void, query?: IDBValidKey | IDBKeyRange | null, direction?: IDBCursorDirection) {
        return $IDBRequest(this.#instance.openCursor(query, direction), (req , resolve) => req.result ? handle(new $IDBCursor(this, req.result)) : resolve(null))
    }

    count(query?: IDBValidKey | IDBKeyRange) {
        return $IDBRequest(this.#instance.count(query));
    }

    get(query: IDBValidKey | IDBKeyRange) {
        return $IDBRequest(this.#instance.get(query))
    }

    getAll(query?: IDBValidKey | IDBKeyRange) {
        return $IDBRequest(this.#instance.getAll(query))
    }
}