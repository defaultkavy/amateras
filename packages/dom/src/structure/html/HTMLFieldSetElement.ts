import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLFieldSetElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        disabled: false,
        form: '',
        name: ''
    }

    constructor() {
        super('fieldset')
    }
}

assignAttributes(HTMLFieldSetElement, HTMLFieldSetElement.defaultAttributes)
_Object_assign(globalThis, { HTMLFieldSetElement })
