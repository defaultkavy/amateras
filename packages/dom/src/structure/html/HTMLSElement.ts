import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLSElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('s')
    }
}

assignAttributes(HTMLSElement, HTMLSElement.defaultAttributes)
_Object_assign(globalThis, { HTMLSElement })
