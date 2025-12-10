import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLBDIElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('bdi')
    }
}

assignAttributes(HTMLBDIElement, HTMLBDIElement.defaultAttributes)
_Object_assign(globalThis, { HTMLBDIElement })
