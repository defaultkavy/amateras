import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLEmbedElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        height: '',
        src: '',
        type: '',
        width: ''
    }

    constructor() {
        super('embed')
    }
}

assignAttributes(HTMLEmbedElement, HTMLEmbedElement.defaultAttributes)
_Object_assign(globalThis, { HTMLEmbedElement })
