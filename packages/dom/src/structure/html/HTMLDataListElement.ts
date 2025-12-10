import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLDataListElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('datalist')
    }
}

assignAttributes(HTMLDataListElement, HTMLDataListElement.defaultAttributes)
_Object_assign(globalThis, { HTMLDataListElement })
