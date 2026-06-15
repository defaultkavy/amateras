import * as core from './index';

declare global {
    export import $ = core.$

    export interface Node {
        $: core.NodeProto
    }

    export interface Element {
        $: core.ElementProto
    }
}