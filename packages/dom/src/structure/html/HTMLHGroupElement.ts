import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLHGroupElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('hgroup')
    }
}

assignAttributes(HTMLHGroupElement, HTMLHGroupElement.defaultAttributes)
_Object_assign(globalThis, { HTMLHGroupElement })
