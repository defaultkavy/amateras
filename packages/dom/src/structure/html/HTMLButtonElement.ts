import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLButtonElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        autofocus: false,
        disabled: false,
        form: '',
        formAction: '',
        formEncType: '',
        formMethod: '',
        formNoValidate: false,
        name: '',
        type: 'submit',
        value: ''
    }

    constructor() {
        super('button')
    }
}

assignAttributes(HTMLButtonElement, HTMLButtonElement.defaultAttributes)
_Object_assign(globalThis, { HTMLButtonElement })
