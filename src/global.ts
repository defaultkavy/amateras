import type { $Element } from '#node/$Element';
import type { $Node } from '#node/$Node';
import * as core from '#core';
import type { $EventTarget } from '#node/$EventTarget';

declare global {
    export import $ = core.$;
    type Nullish = null | undefined;
    type OrArray<T> = T | T[];
    type OrMatrix<T> = T | OrMatrix<T>[];
    type OrPromise<T> = T | Promise<T>;
    type OrNullish<T> = T | Nullish;
    type Constructor<T> = { new (...args: any[]): T }
    type Mutable<T> = {
        -readonly [P in keyof T]: T[P];
    }
    type AsyncFunction<T> = () => Promise<T>;
    type $Parameter<T> = T | undefined | $.$NodeParameterExtends<T>
    type Ok<D> = [data: D, err: null];
    type Err<E> = [data: null, err: E]
    type Result<D, E> = Ok<D> | Err<E>
    type Repeat<T, N extends number, Acc extends T[] = []> = 
        Acc['length'] extends N 
            ? Acc 
            : Repeat<T, N, [...Acc, T]>;
    type Prettify<T> = {
        [K in keyof T]: T[K];
    } & {};
    type Narrow<T> = T extends boolean ? boolean : T;
    interface Node {
        readonly $: $Node
    }
    interface EventTarget {
        readonly $: $EventTarget
    }
    interface Element {
        readonly $: $Element
    }
}