import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLTextAreaElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        autocomplete: '',
        autofocus: false,
        cols: 20,
        defaultValue: '',
        dirName: '',
        disabled: false,
        form: '',
        inputMode: '',
        maxLength: -1,
        minLength: -1,
        name: '',
        placeholder: '',
        readOnly: false,
        required: false,
        rows: 2,
        value: '',
        wrap: 'soft'
    }

    constructor() {
        super('textarea')
    }
}

assignAttributes(HTMLTextAreaElement, HTMLTextAreaElement.defaultAttributes)
_Object_assign(globalThis, { HTMLTextAreaElement })
