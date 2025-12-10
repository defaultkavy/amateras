import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLScriptElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        async: false,
        charset: '',
        crossOrigin: '',
        defer: false,
        fetchPriority: 'auto',
        integrity: '',
        noModule: false,
        referrerPolicy: '',
        src: '',
        text: '',
        type: ''
    }

    constructor() {
        super('script')
    }
}

assignAttributes(HTMLScriptElement, HTMLScriptElement.defaultAttributes)
_Object_assign(globalThis, { HTMLScriptElement })
