import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLIFrameElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        allow: '',
        allowFullscreen: false,
        allowUserMedia: false,
        cSP: '',
        frameBorder: '1',
        height: '',
        loading: 'auto',
        marginHeight: '',
        marginWidth: '',
        name: '',
        referrerPolicy: '',
        sandbox: '',
        scrolling: 'auto',
        src: '',
        srcDoc: ''
    }

    constructor() {
        super('iframe')
    }
}

assignAttributes(HTMLIFrameElement, HTMLIFrameElement.defaultAttributes)
_Object_assign(globalThis, { HTMLIFrameElement })
