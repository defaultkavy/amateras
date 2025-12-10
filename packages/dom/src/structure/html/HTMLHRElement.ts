import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLHRElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        align: '',
        color: '',
        noShade: false,
        size: '',
        width: ''
    }

    constructor() {
        super('hr')
    }
}

assignAttributes(HTMLHRElement, HTMLHRElement.defaultAttributes)
_Object_assign(globalThis, { HTMLHRElement })
