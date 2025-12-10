import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLTableElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        align: '',
        bgColor: '',
        border: '',
        borderColor: '',
        cellPadding: '',
        cellSpacing: '',
        frame: '',
        rules: '',
        summary: '',
        width: ''
    }

    constructor() {
        super('table')
    }
}

assignAttributes(HTMLTableElement, HTMLTableElement.defaultAttributes)
_Object_assign(globalThis, { HTMLTableElement })
