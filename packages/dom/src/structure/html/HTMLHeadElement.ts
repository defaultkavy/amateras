import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLHeadElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('head')
    }
}

assignAttributes(HTMLHeadElement, HTMLHeadElement.defaultAttributes)
_Object_assign(globalThis, { HTMLHeadElement })
