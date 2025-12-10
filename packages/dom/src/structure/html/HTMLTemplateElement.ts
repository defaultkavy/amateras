import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLTemplateElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        content: null
    }

    constructor() {
        super('template')
    }
}

assignAttributes(HTMLTemplateElement, HTMLTemplateElement.defaultAttributes)
_Object_assign(globalThis, { HTMLTemplateElement })
