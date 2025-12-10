import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLMapElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        name: ''
    }

    constructor() {
        super('map')
    }
}

assignAttributes(HTMLMapElement, HTMLMapElement.defaultAttributes)
_Object_assign(globalThis, { HTMLMapElement })
