import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLTableCellElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        abbr: '',
        align: '',
        axis: '',
        bgColor: '',
        cellIndex: 0,
        ch: '',
        chOff: '',
        colSpan: 1,
        headers: '',
        height: '',
        noWrap: false,
        rowSpan: 1,
        scope: '',
        vAlign: '',
        width: ''
    }

    constructor(tag: string = 'td') {
        super(tag)
    }
}

assignAttributes(HTMLTableCellElement, HTMLTableCellElement.defaultAttributes)
_Object_assign(globalThis, { HTMLTableCellElement })
