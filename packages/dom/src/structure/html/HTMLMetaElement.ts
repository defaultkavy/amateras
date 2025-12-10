import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLMetaElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        charset: '',
        content: '',
        httpEquiv: '',
        media: '',
        name: '',
        scheme: ''
    }

    constructor() {
        super('meta')
    }
}

assignAttributes(HTMLMetaElement, HTMLMetaElement.defaultAttributes)
_Object_assign(globalThis, { HTMLMetaElement })
