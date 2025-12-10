import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLTitleElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        text: ''
    }

    constructor() {
        super('title')
    }
}

assignAttributes(HTMLTitleElement, HTMLTitleElement.defaultAttributes)
_Object_assign(globalThis, { HTMLTitleElement })
