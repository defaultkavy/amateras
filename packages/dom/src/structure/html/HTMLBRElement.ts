import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLBRElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        clear: ''
    }

    constructor() {
        super('br')
    }
}

assignAttributes(HTMLBRElement, HTMLBRElement.defaultAttributes)
_Object_assign(globalThis, { HTMLBRElement })
