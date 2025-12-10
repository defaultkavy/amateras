import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLCodeElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('code')
    }
}

assignAttributes(HTMLCodeElement, HTMLCodeElement.defaultAttributes)
_Object_assign(globalThis, { HTMLCodeElement })
