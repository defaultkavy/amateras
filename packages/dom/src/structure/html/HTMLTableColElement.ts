import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLTableColElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        align: '',
        ch: '',
        chOff: '',
        colSpan: 1,
        span: 1,
        vAlign: '',
        width: ''
    }

    constructor(tag: string = 'col') {
        super(tag)
    }
}

assignAttributes(HTMLTableColElement, HTMLTableColElement.defaultAttributes)
_Object_assign(globalThis, { HTMLTableColElement })
