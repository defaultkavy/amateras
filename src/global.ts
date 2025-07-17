import type { $Element } from '#node/$Element';
import type { $Node } from '#node/$Node';
import * as core from '#core';
import type { Signal } from '#structure/Signal';

declare global {
    export import $ = core.$;
    type Nullish = null | undefined;
    type OrArray<T> = T | T[];
    type OrMatrix<T> = T | OrMatrix<T>[];
    type OrPromise<T> = T | Promise<T>;
    type OrNullish<T> = T | Nullish;
    type Constructor<T> = { new (...args: any[]): T }
    type $Parameter<T> = T | undefined | Signal<T> | Signal<T | undefined>
    type Repeat<T, N extends number, Acc extends T[] = []> = 
        Acc['length'] extends N 
            ? Acc 
            : Repeat<T, N, [...Acc, T]>;
    type Prettify<T> = {
        [K in keyof T]: T[K];
    } & {};
    interface Node {
        readonly $: $Node
    }
    interface Element {
        readonly $: $Element
    }
}