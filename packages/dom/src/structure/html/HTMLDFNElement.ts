import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLDFNElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('dfn')
    }
}

assignAttributes(HTMLDFNElement, HTMLDFNElement.defaultAttributes)
_Object_assign(globalThis, { HTMLDFNElement })
