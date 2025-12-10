import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLHeadingElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        align: ''
    }

    constructor(tag: string = 'h1') {
        super(tag)
    }
}

assignAttributes(HTMLHeadingElement, HTMLHeadingElement.defaultAttributes)
_Object_assign(globalThis, { HTMLHeadingElement })
