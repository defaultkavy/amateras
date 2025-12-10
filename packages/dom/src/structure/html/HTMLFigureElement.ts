import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLFigureElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('figure')
    }
}

assignAttributes(HTMLFigureElement, HTMLFigureElement.defaultAttributes)
_Object_assign(globalThis, { HTMLFigureElement })
