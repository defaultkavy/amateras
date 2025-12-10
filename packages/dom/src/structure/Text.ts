import { _Object_assign } from "@amateras/utils";
import { Node } from "./Node";

export class Text extends Node {
    #textContent: string;
    constructor(str: string) {
        super('#text');
        this.#textContent = str;
    }

    get textContent() {
        return this.#textContent;
    }

    toString() {
        return this.#textContent;
    }
}

_Object_assign(globalThis, { Text })