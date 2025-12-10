import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLSpanElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('span')
    }
}

assignAttributes(HTMLSpanElement, HTMLSpanElement.defaultAttributes)
_Object_assign(globalThis, { HTMLSpanElement })
