import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLProgressElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        form: '',
        max: 1,
        value: 0
    }

    constructor() {
        super('progress')
    }
}

assignAttributes(HTMLProgressElement, HTMLProgressElement.defaultAttributes)
_Object_assign(globalThis, { HTMLProgressElement })
