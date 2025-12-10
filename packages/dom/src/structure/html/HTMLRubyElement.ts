import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLRubyElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('ruby')
    }
}

assignAttributes(HTMLRubyElement, HTMLRubyElement.defaultAttributes)
_Object_assign(globalThis, { HTMLRubyElement })
