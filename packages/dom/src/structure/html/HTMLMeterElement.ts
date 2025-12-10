import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLMeterElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        form: '',
        high: '',
        low: '',
        max: '1',
        min: '0',
        optimum: '',
        value: ''
    }

    constructor() {
        super('meter')
    }
}

assignAttributes(HTMLMeterElement, HTMLMeterElement.defaultAttributes)
_Object_assign(globalThis, { HTMLMeterElement })
