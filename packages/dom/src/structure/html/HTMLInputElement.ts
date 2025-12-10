import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLInputElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        accept: '',
        alt: '',
        autocomplete: '',
        autofocus: false,
        capture: false,
        checked: false,
        defaultChecked: false,
        defaultValue: '',
        dirName: '',
        disabled: false,
        form: '',
        formAction: '',
        formEncType: '',
        formMethod: '',
        formNoValidate: false,
        height: '',
        indeterminate: false,
        list: '',
        max: '',
        maxLength: -1,
        min: '',
        minLength: -1,
        multiple: false,
        name: '',
        pattern: '',
        placeholder: '',
        readOnly: false,
        required: false,
        size: 20,
        src: '',
        step: '',
        type: 'text',
        useMap: '',
        value: '',
        valueAsDate: null,
        valueAsNumber: NaN,
        width: '',
        webkitEntries: '',
        webkitDirectories: false
    }

    constructor() {
        super('input')
    }
}

assignAttributes(HTMLInputElement, HTMLInputElement.defaultAttributes)
_Object_assign(globalThis, { HTMLInputElement })
