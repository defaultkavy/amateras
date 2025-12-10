import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLMainElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('main')
    }
}

assignAttributes(HTMLMainElement, HTMLMainElement.defaultAttributes)
_Object_assign(globalThis, { HTMLMainElement })
