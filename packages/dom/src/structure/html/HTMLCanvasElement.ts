import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLCanvasElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        height: 150,
        width: 300
    }

    constructor() {
        super('canvas')
    }
}

assignAttributes(HTMLCanvasElement, HTMLCanvasElement.defaultAttributes)
_Object_assign(globalThis, { HTMLCanvasElement })
