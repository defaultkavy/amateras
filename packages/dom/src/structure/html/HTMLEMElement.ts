import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLEMElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('em')
    }
}

assignAttributes(HTMLEMElement, HTMLEMElement.defaultAttributes)
_Object_assign(globalThis, { HTMLEMElement })
