import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLOptGroupElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        disabled: false,
        label: ''
    }

    constructor() {
        super('optgroup')
    }
}

assignAttributes(HTMLOptGroupElement, HTMLOptGroupElement.defaultAttributes)
_Object_assign(globalThis, { HTMLOptGroupElement })
