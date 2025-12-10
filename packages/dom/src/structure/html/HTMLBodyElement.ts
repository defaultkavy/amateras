import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLBodyElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        aLink: '',
        background: '',
        bgColor: '',
        link: '',
        text: '',
        vLink: ''
    }

    constructor() {
        super('body')
    }
}

assignAttributes(HTMLBodyElement, HTMLBodyElement.defaultAttributes)
_Object_assign(globalThis, { HTMLBodyElement })
