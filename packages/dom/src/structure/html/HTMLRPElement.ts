import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLRPElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('rp')
    }
}

assignAttributes(HTMLRPElement, HTMLRPElement.defaultAttributes)
_Object_assign(globalThis, { HTMLRPElement })
