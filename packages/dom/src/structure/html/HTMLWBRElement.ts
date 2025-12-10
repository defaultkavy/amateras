import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLWBRElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('wbr')
    }
}

assignAttributes(HTMLWBRElement, HTMLWBRElement.defaultAttributes)
_Object_assign(globalThis, { HTMLWBRElement })
