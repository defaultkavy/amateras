import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLTableSectionElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        align: '',
        ch: '',
        chOff: '',
        vAlign: ''
    }

    constructor(tag: string = 'tbody') {
        super(tag)
    }
}

assignAttributes(HTMLTableSectionElement, HTMLTableSectionElement.defaultAttributes)
_Object_assign(globalThis, { HTMLTableSectionElement })
