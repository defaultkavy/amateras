import type { $Element } from '#node/$Element';
import type { $Node } from '#node/$Node';
import * as core from '#core';

declare global {
    export import $ = core.$;
    type Nullish = null | undefined;
    type OrArray<T> = T | T[];
    type OrMatrix<T> = T | OrMatrix<T>[];
    type OrPromise<T> = T | Promise<T>;
    type OrNullish<T> = T | Nullish;
    type Constructor<T> = { new (...args: any[]): T }
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