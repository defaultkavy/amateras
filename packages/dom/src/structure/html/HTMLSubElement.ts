import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLSubElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('sub')
    }
}

assignAttributes(HTMLSubElement, HTMLSubElement.defaultAttributes)
_Object_assign(globalThis, { HTMLSubElement })
