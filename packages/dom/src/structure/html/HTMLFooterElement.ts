import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLFooterElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('footer')
    }
}

assignAttributes(HTMLFooterElement, HTMLFooterElement.defaultAttributes)
_Object_assign(globalThis, { HTMLFooterElement })
