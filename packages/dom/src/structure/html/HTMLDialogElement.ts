import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLDialogElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        open: false,
        returnValue: ''
    }

    constructor() {
        super('dialog')
    }
}

assignAttributes(HTMLDialogElement, HTMLDialogElement.defaultAttributes)
_Object_assign(globalThis, { HTMLDialogElement })
