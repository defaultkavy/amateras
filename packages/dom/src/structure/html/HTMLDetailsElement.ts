import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLDetailsElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        open: false
    }

    constructor() {
        super('details')
    }
}

assignAttributes(HTMLDetailsElement, HTMLDetailsElement.defaultAttributes)
_Object_assign(globalThis, { HTMLDetailsElement })
