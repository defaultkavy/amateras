import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLMarkElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('mark')
    }
}

assignAttributes(HTMLMarkElement, HTMLMarkElement.defaultAttributes)
_Object_assign(globalThis, { HTMLMarkElement })
