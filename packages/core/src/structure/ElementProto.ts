import { _Array_from, _Object_entries, forEach, isNull, isUndefined, map } from "@amateras/utils";
import { NodeProto } from "./NodeProto";

const SELF_CLOSING_TAGNAMES = ['img', 'hr', 'br', 'input', 'link', 'meta'];

export class ElementProto<H extends HTMLElement = HTMLElement> extends NodeProto<H> {
    name: string;
    #attr = new Map<string, string>();
    declare layout: $.Layout | null;
    #innerHTML = '';
    constructor(tagname: string, attrObj: $.Props | null, layout?: $.Layout | null) {
        super(() => layout?.(this));
        this.name = tagname;
        if (attrObj) this.attrProcess(attrObj);
    }

    on<K extends keyof HTMLElementEventMap>(type: K, listener: (event: HTMLElementEventMap[K] & { currentTarget: H }) => void) {
        this.ondom(node => {
            node.addEventListener(type, listener as any)
            this.disposers.add(() => node.removeEventListener(type, listener as any))
        });
    }

    override toString(): string {
        return this.parseHTML()
    }

    parseHTML(options?: { children?: string, attr?: string }) {
        let tagname = this.name;
        let childrenHTML = options?.children ?? (this.#innerHTML || map(this.protos, proto => `${proto}`).join(''));
        let attr = options?.attr ?? map(this.#attr, ([key, value]) => value.length ? `${key}="${value}"` : key).join(' ');
        let attrText = attr.length ? ' ' + attr : '';
        if (SELF_CLOSING_TAGNAMES.includes(tagname)) return `<${tagname}${attrText} />`;
        return `<${tagname}${attrText}>${childrenHTML}</${tagname}>`;
    }

    override toDOM(children = true): H[] {
        if (this.node) return [this.node];
        let element = document.createElement(this.name) as H;
        this.node = element;
        if (this.#innerHTML) this.node.innerHTML = this.#innerHTML;
        else if (children) element.append(...map(this.protos, proto => proto.toDOM(children)).flat());
        forEach(this.#attr, ([key, value]) => element.setAttribute(key, value));
        forEach(this.modifiers, process => process(element));
        return [element];
    }

    private attrProcess(attrObj: $.Props) {
        forEach(_Object_entries(attrObj), ([key, value]) => {
            for (let process of $.process.attr) {
                let result = process(key, value, this as any);
                if (!isUndefined(result)) return;
            }
            this.#attr.set(key, value as string);
        })
    }

    innerHTML(html: string) {
        this.#innerHTML = html;
    }

    attr(): Map<string, string>;
    attr(attrName: string): string | undefined;
    attr(attrName: string, attrValue: string | null): this;
    attr(attrName?: string, attrValue?: string | null) {
        if (!arguments.length) return this.#attr;
        if (isUndefined(attrValue)) return this.#attr.get(attrName!);
        if (isNull(attrValue)) {
            this.#attr.delete(attrName!);
            this.node?.removeAttribute(attrName!);
        }
        else {
            this.#attr.set(attrName!, attrValue);
            this.node?.setAttribute(attrName!, attrValue);
        }
        return this;
    }

    addClass(...tokens: string[]) {
        this.token('add', 'class', ...tokens)
        this.node?.classList.add(...tokens);
    }

    removeClass(...tokens: string[]) {
        this.token('delete', 'class', ...tokens)
        this.node?.classList.remove(...tokens);
    }

    private token(method: 'add' | 'delete', name: string, ...tokens: string[]) {
        let value = this.#attr.get(name);
        let tokenArr = new Set(value?.split(' ') ?? []);
        forEach(tokens, t => tokenArr[method](t));
        this.#attr.set(name, _Array_from(tokenArr).join(' '));
    }
}