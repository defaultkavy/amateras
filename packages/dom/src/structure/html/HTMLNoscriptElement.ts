import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLNoscriptElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('noscript')
    }
}

assignAttributes(HTMLNoscriptElement, HTMLNoscriptElement.defaultAttributes)
_Object_assign(globalThis, { HTMLNoscriptElement })
