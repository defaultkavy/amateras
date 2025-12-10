import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLStrongElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('strong')
    }
}

assignAttributes(HTMLStrongElement, HTMLStrongElement.defaultAttributes)
_Object_assign(globalThis, { HTMLStrongElement })
