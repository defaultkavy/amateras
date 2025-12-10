import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLDataElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        value: ''
    }

    constructor() {
        super('data')
    }
}

assignAttributes(HTMLDataElement, HTMLDataElement.defaultAttributes)
_Object_assign(globalThis, { HTMLDataElement })
