import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLBDOElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('bdo')
    }
}

assignAttributes(HTMLBDOElement, HTMLBDOElement.defaultAttributes)
_Object_assign(globalThis, { HTMLBDOElement })
