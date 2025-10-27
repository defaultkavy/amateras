import type { $Element } from '#node/$Element';
import type { $Node } from '#node/$Node';
import * as core from './index';
import type { $EventTarget } from '#node/$EventTarget';

declare global {
    export import $ = core.$;
    type $Parameter<T> = T | undefined | $.$NodeParameterExtends<T>
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