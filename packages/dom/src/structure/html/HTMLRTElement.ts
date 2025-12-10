import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLRTElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('rt')
    }
}

assignAttributes(HTMLRTElement, HTMLRTElement.defaultAttributes)
_Object_assign(globalThis, { HTMLRTElement })
