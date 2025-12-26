import { $Node } from "#node/$Node";
import { forEach } from "@amateras/utils";

export class $TextNode extends $Node {
    #textContent: string;
    constructor(str: string) {
        super('#text');
        this.#textContent = str;
    }

    override toHTML(): string {
        return this.#textContent;
    }

    override toDOM(parent?: Node): Node {
        const text = new Text(this.#textContent)
        parent?.appendChild(text);
        forEach(this._ondom, fn => fn(text))
        return text;
    }
}