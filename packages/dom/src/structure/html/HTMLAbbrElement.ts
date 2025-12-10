import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLAbbrElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('abbr')
    }
}

assignAttributes(HTMLAbbrElement, HTMLAbbrElement.defaultAttributes)
_Object_assign(globalThis, { HTMLAbbrElement })
