import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLUListElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        compact: false,
        type: ''
    }

    constructor() {
        super('ul')
    }
}

assignAttributes(HTMLUListElement, HTMLUListElement.defaultAttributes)
_Object_assign(globalThis, { HTMLUListElement })
