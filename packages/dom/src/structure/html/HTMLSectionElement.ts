import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLSectionElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('section')
    }
}

assignAttributes(HTMLSectionElement, HTMLSectionElement.defaultAttributes)
_Object_assign(globalThis, { HTMLSectionElement })
