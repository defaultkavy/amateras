import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLPreElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        width: ''
    }

    constructor() {
        super('pre')
    }
}

assignAttributes(HTMLPreElement, HTMLPreElement.defaultAttributes)
_Object_assign(globalThis, { HTMLPreElement })
