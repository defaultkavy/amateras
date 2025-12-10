import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLIElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('i')
    }
}

assignAttributes(HTMLIElement, HTMLIElement.defaultAttributes)
_Object_assign(globalThis, { HTMLIElement })
