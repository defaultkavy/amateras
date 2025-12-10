import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLOutputElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        form: '',
        htmlFor: '',
        name: '',
        value: ''
    }

    constructor() {
        super('output')
    }
}

assignAttributes(HTMLOutputElement, HTMLOutputElement.defaultAttributes)
_Object_assign(globalThis, { HTMLOutputElement })
