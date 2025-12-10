import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLAnchorElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        href: '',
        download: '',
        hreflang: '',
        ping: '',
        referrerPolicy: '',
        rel: '',
        target: '',
        text: '',
        type: ''
    }

    constructor() {
        super('a')
    }
}

assignAttributes(HTMLAnchorElement, HTMLAnchorElement.defaultAttributes)
_Object_assign(globalThis, { HTMLAnchorElement })