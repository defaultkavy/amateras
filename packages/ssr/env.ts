import type { $Node } from "@amateras/core/node/$Node";
import { _Array_from, _Object_assign, _Object_entries } from "@amateras/utils";
import { NODE } from "esm-env";

if (NODE) {
    //@ts-expect-error
    global.window = undefined;
    //@ts-expect-error
    global.document = undefined;
    //@ts-expect-error
    global.Node = class Node {
        nodeName: string;
        attributes = {};
        childNodes = new Set<Node>();
        parent?: Node;
        $!: $Node;
        constructor(nodeName: string) {
            this.nodeName = nodeName.toUpperCase();
        }
        get textContent() { return _Array_from(this.childNodes.values()).map(node => node.textContent).join() }
        set textContent(content: string | null) { 
            this.childNodes.clear();
            content && this.childNodes.add(new Text(content) as unknown as Node);
        }
        appendChild(node: Node) {
            if (this.childNodes.has(node)) this.childNodes.delete(node);
            this.childNodes.add(node);
            node.parent = this;
        }
        addEventListener(type: string, cb: () => void) { }
        setAttribute(key: string, value: string) { _Object_assign(this.attributes, {[key]: value}) }
        remove() {
            this.parent?.removeChild(this);
        }
        removeChild(node: Node) {
            this.childNodes.delete(node);
        }

        get outerHTML() {
            const attr = _Object_entries(this.attributes).map(([key, value]) => `${key}="${value}"`).join(' ');
            const tagName = this.nodeName.toLowerCase();
            const IS_VOID_ELEMENT = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'].includes(tagName);
            return `<${tagName}${attr ? ` ${attr}` : ''}>${_Array_from(this.childNodes).map(node => `${node.$}`).join('')}${IS_VOID_ELEMENT && !this.childNodes.size ? '' : `</${tagName}>`}`;
        }
    }
    //@ts-expect-error
    global.Element = class Element {}
    //@ts-expect-error
    global.HTMLElement = class HTMLElement {}
    //@ts-expect-error
    global.Text = class Text {
        textContent: string;
        $: this;
        constructor(textContent: string) {
            this.textContent = textContent;
            this.$ = this;
        }

        toString() { return this.textContent }
    }
}