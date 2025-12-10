import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLSampElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('samp')
    }
}

assignAttributes(HTMLSampElement, HTMLSampElement.defaultAttributes)
_Object_assign(globalThis, { HTMLSampElement })
