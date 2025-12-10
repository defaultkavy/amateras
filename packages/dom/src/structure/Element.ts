import { _Array_from, _Object_assign, _Object_entries, forEach, isArray, isString, isUndefined } from "@amateras/utils";
import { Node } from "./Node";
import { DOMTokenList } from "./DOMTokenList";
import { assignAttributes } from "#lib/assignAttributes";
import { Text } from "./Text";
import { HTMLElement as ParserHTMLElement, Node as ParserNode, TextNode, parse as htmlParse } from 'node-html-parser';
import type { Document } from "./Document";

export class Element extends Node {
    #attributes = new Map<string, any>();
    #classList = new DOMTokenList();
    readonly tagname: string

    static defaultAttributes = {
        id: ''
    }
    
    constructor(nodeName: string) {
        super(nodeName.toUpperCase())
        this.tagname = nodeName.toUpperCase();
    }

    get attributes() {
        return _Array_from(this.#attributes).map(([name, value]) => ({name, value}))
    }

    get innerHTML() {
        const children = _Array_from(this.childNodes).map(node => node.toString());
        return children.join('');
    }

    set innerHTML(html: string) {
        const element = htmlParse(html);
        const createChildElement = (target: Node, ele: ParserNode) => {
            forEach(element.childNodes, node => {
                if (node instanceof TextNode) target.appendChild(new Text(node.textContent));
                const ele = (document as unknown as Document).createElement(node.rawTagName);
                if (node instanceof ParserHTMLElement) {
                    forEach(Object.entries(node.attributes), ([key, value]) => ele.setAttribute(key, value))
                }
                target.appendChild(ele);
                createChildElement(ele, node);
            })
        }

        createChildElement(this, element);
    }

    get outerHTML() {
        const nodeName = this.nodeName.toLowerCase();
        const attr = _Array_from(this.attributes).map(({name, value}) => {
            //@ts-expect-error
            const defaultValue = this.constructor.defaultAttributes[name];
            if (isArray(defaultValue)) value = defaultValue[value ? 1 : 2];
            return `${name}${isString(value) && value ? `="${value}"` : ``}`;
        })
        const IS_SELF_CLOSING = ['img', 'meta', 'input'].includes(nodeName);
        this.#classList.size && attr.unshift(`class="${_Array_from(this.classList).join(' ')}"`)
        return `<${nodeName}${attr.length ? ` ${attr.join(' ')}` : ''}>${this.innerHTML}${IS_SELF_CLOSING ? '' : `</${nodeName}>`}`
    }

    set outerHTML(html: string) {

    }

    toString() {
        return this.outerHTML;
    }

    setAttribute(key: string, value: string) {
        this.#attributes.set(key, value);
    }

    getAttribute(key: string) {
        const value = this.#attributes.get(key)
        if (!isUndefined(value)) return value;
        //@ts-expect-error
        const defaultValue = this.constructor.defaultAttributes[key];
        if (isArray(defaultValue)) return defaultValue[0]
        return defaultValue;
    }

    get classList(): DOMTokenList {
        return this.#classList
    }

    set classList(tokens: string) {
        this.#classList = new DOMTokenList(tokens.split(' '));
    }

    set textContent(text: string) {
        forEach(this.childNodes, node => node.remove());
        this.appendChild(new Text(text));
    }

    get textContent() {
        const strings = _Array_from(this.childNodes).map(node => {
            if (node instanceof Text) return node.textContent;
            else if (node instanceof Element) return node.textContent;
        })
        return strings.join('')
    }
}

assignAttributes(Element, Element.defaultAttributes)
_Object_assign(globalThis, { Element })