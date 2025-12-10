import { _Array_from, _null, _Object_assign, isUndefined } from "@amateras/utils";
import { NodeList } from "./NodeList";

export class Node extends EventTarget {
    readonly nodeName: string
    constructor(nodeName: string) {
        super();
        this.nodeName = nodeName;
    }
    #childNodes = new NodeList();
    get childNodes() { return this.#childNodes }

    parentElement: null | Node = _null;

    appendChild(node: Node) {
        this.#childNodes.delete(node);
        this.#childNodes.add(node);
        node.parentElement = this;
    }

    insertBefore(node: Node, target: Node) {
        this.#childNodes.delete(node);
        const nodeList = _Array_from(this.childNodes);
        const index = nodeList.indexOf(target);
        if (isUndefined(target) || index === -1) this.appendChild(node);
        else {
            this.#childNodes = new NodeList([...nodeList.slice(0, index - 1), node, ...nodeList.slice(index)]);
            node.parentElement = this;
        }
    }

    remove() {
        this.parentElement?.childNodes.delete(this);
        this.parentElement = _null;
    }

    contains(node: Node) {
        for (const childNode of this.#childNodes) {
            if (node === childNode) return true;
            else if (node.contains(node)) return true;
        }
        return false
    }

    toString() {}

    addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean): void {}
    removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void {}
}

_Object_assign(globalThis, { Node })