import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLMenuElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        compact: false,
        label: ''
    }

    constructor() {
        super('menu')
    }
}

assignAttributes(HTMLMenuElement, HTMLMenuElement.defaultAttributes)
_Object_assign(globalThis, { HTMLMenuElement })
