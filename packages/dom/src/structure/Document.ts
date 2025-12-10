import { _Object_assign } from "@amateras/utils"
import { Node } from "./Node";
import { HTMLElement } from "./HTMLElement";
import { htmlElementMap } from "#lib/HTMLElementMap";
import { Text } from "./Text";

export class Document extends Node {
    adoptedStyleSheets = [];
    documentElement = this.createElement('html');
    head = this.createElement('head');
    body = this.createElement('body');
    #ele_title: null | HTMLElement = null;
    constructor() {
        super('#document');
        this.appendChild(this.documentElement);
        this.documentElement.appendChild(this.head);
        this.documentElement.appendChild(this.body);
    }

    createElement(nodeName: string): HTMLElement {
        const constructor = htmlElementMap.get(nodeName);
        if (constructor) return new constructor();
        return new HTMLElement(nodeName)
    }

    set title(title: string) {
        if (title.length) {
            this.#ele_title?.remove();
            this.#ele_title = this.createElement('title');
            this.#ele_title.appendChild(new Text(title))
            this.head.appendChild(this.#ele_title);
        } else this.#ele_title?.remove();
    }
}

_Object_assign(globalThis, { Document })