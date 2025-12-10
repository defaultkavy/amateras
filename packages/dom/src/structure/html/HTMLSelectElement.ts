import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLSelectElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        autocomplete: '',
        autofocus: false,
        disabled: false,
        form: '',
        length: 0,
        multiple: false,
        name: '',
        required: false,
        selectedIndex: -1,
        size: 0,
        value: ''
    }

    constructor() {
        super('select')
    }
}

assignAttributes(HTMLSelectElement, HTMLSelectElement.defaultAttributes)
_Object_assign(globalThis, { HTMLSelectElement })
