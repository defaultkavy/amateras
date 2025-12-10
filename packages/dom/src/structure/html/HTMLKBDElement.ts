import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLKBDElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('kbd')
    }
}

assignAttributes(HTMLKBDElement, HTMLKBDElement.defaultAttributes)
_Object_assign(globalThis, { HTMLKBDElement })
