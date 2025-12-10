import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLBElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('b')
    }
}

assignAttributes(HTMLBElement, HTMLBElement.defaultAttributes)
_Object_assign(globalThis, { HTMLBElement })
