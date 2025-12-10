import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLParagraphElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        align: ''
    }

    constructor() {
        super('p')
    }
}

assignAttributes(HTMLParagraphElement, HTMLParagraphElement.defaultAttributes)
_Object_assign(globalThis, { HTMLParagraphElement })
