import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLSupElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('sup')
    }
}

assignAttributes(HTMLSupElement, HTMLSupElement.defaultAttributes)
_Object_assign(globalThis, { HTMLSupElement })
