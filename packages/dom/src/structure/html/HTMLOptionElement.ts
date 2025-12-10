import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLOptionElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        disabled: false,
        label: '',
        selected: false,
        value: ''
    }

    constructor() {
        super('option')
    }
}

assignAttributes(HTMLOptionElement, HTMLOptionElement.defaultAttributes)
_Object_assign(globalThis, { HTMLOptionElement: HTMLOptionElement })
