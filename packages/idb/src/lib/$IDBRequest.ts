import { _Promise } from "@amateras/utils";

export const $IDBRequest = <T>(req: IDBRequest<T>, handle?: (req: IDBRequest<T>, resolve: (value: T) => void) => void) => {
    return new _Promise<T>((resolve, reject) => {
        req.onsuccess = _ => handle ? handle(req, resolve) : resolve(req.result);
        req.onerror = _ => reject(req.error);
    })
}