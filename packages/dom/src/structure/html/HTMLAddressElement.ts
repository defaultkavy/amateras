import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLAddressElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('address')
    }
}

assignAttributes(HTMLAddressElement, HTMLAddressElement.defaultAttributes)
_Object_assign(globalThis, { HTMLAddressElement })
