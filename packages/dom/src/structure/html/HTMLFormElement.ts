import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLFormElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        acceptCharset: '',
        action: '',
        autocomplete: 'on',
        encType: 'application/x-www-form-urlencoded',
        method: 'get',
        name: '',
        noValidate: false,
        target: ''
    }

    constructor() {
        super('form')
    }
}

assignAttributes(HTMLFormElement, HTMLFormElement.defaultAttributes)
_Object_assign(globalThis, { HTMLFormElement })
