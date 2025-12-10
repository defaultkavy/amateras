import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLBaseElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        href: '',
        target: ''
    }

    constructor() {
        super('base')
    }
}

assignAttributes(HTMLBaseElement, HTMLBaseElement.defaultAttributes)
_Object_assign(globalThis, { HTMLBaseElement })
