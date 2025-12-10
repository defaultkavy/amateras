import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLHeaderElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('header')
    }
}

assignAttributes(HTMLHeaderElement, HTMLHeaderElement.defaultAttributes)
_Object_assign(globalThis, { HTMLHeaderElement })
