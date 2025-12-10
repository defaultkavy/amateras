import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLLabelElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        form: '',
        htmlFor: ''
    }

    constructor() {
        super('label')
    }
}

assignAttributes(HTMLLabelElement, HTMLLabelElement.defaultAttributes)
_Object_assign(globalThis, { HTMLLabelElement })
