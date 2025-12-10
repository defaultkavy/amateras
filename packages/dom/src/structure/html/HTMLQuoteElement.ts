import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLQuoteElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        cite: ''
    }

    constructor(tag: string = 'blockquote') {
        super(tag)
    }
}

assignAttributes(HTMLQuoteElement, HTMLQuoteElement.defaultAttributes)
_Object_assign(globalThis, { HTMLQuoteElement })
