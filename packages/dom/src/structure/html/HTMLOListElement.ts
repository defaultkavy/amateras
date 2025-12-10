import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLOListElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        compact: false,
        reversed: false,
        start: 1,
        type: ''
    }

    constructor() {
        super('ol')
    }
}

assignAttributes(HTMLOListElement, HTMLOListElement.defaultAttributes)
_Object_assign(globalThis, { HTMLOListElement })
