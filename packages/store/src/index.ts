import { Store, type StoreInit } from "#structure/Store";
import { Utils } from '@amateras/utils';

declare global {
    export namespace $ {
        export function store<T, Args extends any[]>(init: StoreInit<T, Args>): Store<T, Args>
    }
}

Utils.assign($, {
    store: <T>(init: StoreInit<T>) => new Store(init)
})

export * from '#structure/Store';