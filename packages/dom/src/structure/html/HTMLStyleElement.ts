import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLStyleElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        media: '',
        type: ''
    }

    constructor() {
        super('style')
    }
}

assignAttributes(HTMLStyleElement, HTMLStyleElement.defaultAttributes)
_Object_assign(globalThis, { HTMLStyleElement })
