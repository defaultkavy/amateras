import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLLIElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        type: '',
        value: 0
    }

    constructor() {
        super('li')
    }
}

assignAttributes(HTMLLIElement, HTMLLIElement.defaultAttributes)
_Object_assign(globalThis, { HTMLLIElement })
