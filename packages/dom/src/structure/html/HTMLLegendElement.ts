import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLLegendElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        align: ''
    }

    constructor() {
        super('legend')
    }
}

assignAttributes(HTMLLegendElement, HTMLLegendElement.defaultAttributes)
_Object_assign(globalThis, { HTMLLegendElement })
