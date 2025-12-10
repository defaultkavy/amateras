import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLSourceElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        media: '',
        sizes: '',
        src: '',
        srcSet: '',
        type: ''
    }

    constructor() {
        super('source')
    }
}

assignAttributes(HTMLSourceElement, HTMLSourceElement.defaultAttributes)
_Object_assign(globalThis, { HTMLSourceElement })
