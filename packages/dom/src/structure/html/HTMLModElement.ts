import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLModElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        cite: '',
        dateTime: ''
    }

    constructor(tag: string = 'del') {
        super(tag)
    }
}

assignAttributes(HTMLModElement, HTMLModElement.defaultAttributes)
_Object_assign(globalThis, { HTMLModElement })
