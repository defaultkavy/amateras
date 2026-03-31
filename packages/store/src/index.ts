import { Store, type StoreInit } from "#structure/Store";
import { _Object_assign } from "@amateras/utils";

declare global {
    export namespace $ {
        export function store<T>(init: StoreInit<T>): Store<T>
    }
}

_Object_assign($, {
    store: <T>(init: StoreInit<T>) => new Store(init)
})

export * from '#structure/Store';