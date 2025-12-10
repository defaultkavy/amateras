import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLDDElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('dd')
    }
}

assignAttributes(HTMLDDElement, HTMLDDElement.defaultAttributes)
_Object_assign(globalThis, { HTMLDDElement })
