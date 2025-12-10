import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLNavElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('nav')
    }
}

assignAttributes(HTMLNavElement, HTMLNavElement.defaultAttributes)
_Object_assign(globalThis, { HTMLNavElement })
