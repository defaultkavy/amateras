import { _Object_assign, forEach } from "@amateras/utils";

export class DOMTokenList extends Set {
    constructor(tokens?: string[]) {
        super(tokens);
    }

    add(...tokens: string[]) {
        forEach(tokens, token => super.add(token));
        return this;
    }

    remove(...tokens: string[]) {
        forEach(tokens, token => super.delete(token));
        return this;
    }
}

_Object_assign(globalThis, { DOMTokenList })