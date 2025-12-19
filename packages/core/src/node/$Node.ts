import { _document } from "#env";
import { _Array_from, _null, _undefined, forEach, map } from "@amateras/utils";

export class $Node {
    static parent: $Node | null = _null;
    tagname: string
    nodes = new Set<$Node>();
    attr = new Map<string, string>();
    protected _ondom = new Set<(node: Node) => void>();
    constructor(tagname: string) {
        this.tagname = tagname;
    }

    toDOM(parent?: Node): Node {
        const element = _document.createElement(this.tagname);
        forEach(this.attr, ([key, value]) => element.setAttribute(key, value));
        parent?.appendChild(element);
        forEach(this._ondom, fn => fn(element));
        forEach(this.nodes, child => child.toDOM(element));
        return element;
    }

    toHTML(): string {
        const attr = map(this.attr, ([key, value]) => `${key}="${value}"`);
        const innerHTML = map(this.nodes, node => node.toHTML());
        return `<${this.tagname}${attr.length ? ' ' + attr.join(' ') : ''}>${innerHTML.join('')}</${this.tagname}>`
    }

    ondom(fn: (node: Node) => void) {
        this._ondom.add(fn);
        return this;
    }

    addTokens(attrName: string, ...tokens: string[]) {
        let oldToken = this.attr.get(attrName);
        this.attr.set(attrName, [oldToken, ...tokens].join(' ').trim());
    }

    removeTokens(attrName: string, ...tokens: string[]) {
        let oldToken = this.attr.get(attrName);
        if (!oldToken) return;
        let tokenSet = new Set(oldToken.split(' '));
        forEach(tokens, token => tokenSet.delete(token));
        this.attr.set(attrName, _Array_from(tokenSet).join(' '))
    }
}