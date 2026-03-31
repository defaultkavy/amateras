import { Store, type StoreInit } from "#structure/Store";
import { _Object_assign } from "@amateras/utils";

declare global {
    export namespace $ {
        export function store<T, Args extends any[]>(init: StoreInit<T, Args>): Store<T, Args>
    }
}

_Object_assign($, {
    store: <T>(init: StoreInit<T>) => new Store(init)
})

export * from '#structure/Store';