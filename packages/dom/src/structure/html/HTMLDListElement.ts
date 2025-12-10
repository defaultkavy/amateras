import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLDListElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        compact: false
    }

    constructor() {
        super('dl')
    }
}

assignAttributes(HTMLDListElement, HTMLDListElement.defaultAttributes)
_Object_assign(globalThis, { HTMLDListElement })
