import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLLinkElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        as: '',
        charset: '',
        crossOrigin: '',
        disabled: false,
        fetchPriority: 'auto',
        href: '',
        hrefLang: '',
        integrity: '',
        media: '',
        referrerPolicy: '',
        rel: '',
        rev: '',
        sizes: '',
        target: '',
        type: ''
    }

    constructor() {
        super('link')
    }
}

assignAttributes(HTMLLinkElement, HTMLLinkElement.defaultAttributes)
_Object_assign(globalThis, { HTMLLinkElement })
