import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLSummaryElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('summary')
    }
}

assignAttributes(HTMLSummaryElement, HTMLSummaryElement.defaultAttributes)
_Object_assign(globalThis, { HTMLSummaryElement })
