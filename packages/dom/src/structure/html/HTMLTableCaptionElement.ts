import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLTableCaptionElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        align: ''
    }

    constructor() {
        super('caption')
    }
}

assignAttributes(HTMLTableCaptionElement, HTMLTableCaptionElement.defaultAttributes)
_Object_assign(globalThis, { HTMLTableCaptionElement })
