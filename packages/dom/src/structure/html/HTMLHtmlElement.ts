import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLHtmlElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        manifest: '',
        version: ''
    }

    constructor() {
        super('html')
    }
}

assignAttributes(HTMLHtmlElement, HTMLHtmlElement.defaultAttributes)
_Object_assign(globalThis, { HTMLHtmlElement })
