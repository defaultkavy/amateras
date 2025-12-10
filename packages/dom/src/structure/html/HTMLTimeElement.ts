import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLTimeElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        dateTime: ''
    }

    constructor() {
        super('time')
    }
}

assignAttributes(HTMLTimeElement, HTMLTimeElement.defaultAttributes)
_Object_assign(globalThis, { HTMLTimeElement })
