import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLCiteElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('cite')
    }
}

assignAttributes(HTMLCiteElement, HTMLCiteElement.defaultAttributes)
_Object_assign(globalThis, { HTMLCiteElement })
