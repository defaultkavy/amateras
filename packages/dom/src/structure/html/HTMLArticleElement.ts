import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLArticleElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes
    }

    constructor() {
        super('article')
    }
}

assignAttributes(HTMLArticleElement, HTMLArticleElement.defaultAttributes)
_Object_assign(globalThis, { HTMLArticleElement })
