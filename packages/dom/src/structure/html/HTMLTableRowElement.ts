import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLTableRowElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        align: '',
        bgColor: '',
        ch: '',
        chOff: '',
        rowIndex: 0,
        sectionRowIndex: 0,
        vAlign: ''
    }

    constructor() {
        super('tr')
    }
}

assignAttributes(HTMLTableRowElement, HTMLTableRowElement.defaultAttributes)
_Object_assign(globalThis, { HTMLTableRowElement })
