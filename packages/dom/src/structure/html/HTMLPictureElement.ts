import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLPictureElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('picture')
    }
}

assignAttributes(HTMLPictureElement, HTMLPictureElement.defaultAttributes)
_Object_assign(globalThis, { HTMLPictureElement })
