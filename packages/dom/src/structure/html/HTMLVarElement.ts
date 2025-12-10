import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLVarElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('var')
    }
}

assignAttributes(HTMLVarElement, HTMLVarElement.defaultAttributes)
_Object_assign(globalThis, { HTMLVarElement })
