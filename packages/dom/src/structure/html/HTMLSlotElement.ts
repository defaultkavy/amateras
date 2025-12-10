import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLSlotElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        name: ''
    }

    constructor() {
        super('slot')
    }
}

assignAttributes(HTMLSlotElement, HTMLSlotElement.defaultAttributes)
_Object_assign(globalThis, { HTMLSlotElement })
