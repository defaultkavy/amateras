import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLAreaElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        alt: '',
        coords: '',
        download: '',
        href: '',
        hreflang: '',
        ping: '',
        referrerPolicy: '',
        rel: '',
        shape: '',
        target: ''
    }

    constructor() {
        super('area')
    }
}

assignAttributes(HTMLAreaElement, HTMLAreaElement.defaultAttributes)
_Object_assign(globalThis, { HTMLAreaElement })
