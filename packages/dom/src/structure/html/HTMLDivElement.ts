import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLDivElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        align: ''
    }

    constructor() {
        super('div')
    }
}

assignAttributes(HTMLDivElement, HTMLDivElement.defaultAttributes)
_Object_assign(globalThis, { HTMLDivElement })
