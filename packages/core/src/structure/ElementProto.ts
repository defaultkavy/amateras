import { _Array_from, _null, _Object_assign, _Object_entries, forEach, isNull, isUndefined, map } from "@amateras/utils";
import { NodeProto } from "./NodeProto";

const SELF_CLOSING_TAGNAMES = ['img', 'hr', 'br', 'input', 'link', 'meta'];

export class ElementProto<H extends HTMLElement = HTMLElement> extends NodeProto<H> {
    tagname: string;
    #attr: Record<string, string> = {};
    declare layout: $.Layout | null;
    #innerHTML = '';
    constructor(tagname: string, props: $.Props | null, layout?: $.Layout | null) {
        super(() => layout?.(this));
        this.tagname = tagname;
        if (props) this.attrProcess(props);
    }

    override dispose(): void {
        super.dispose();
        this.layout = null;
    }

    on<K extends keyof HTMLElementEventMap>(type: K, listener: (event: HTMLElementEventMap[K] & { currentTarget: H }) => void) {
        let setListener = (node: Node) => {
            node.addEventListener(type, listener as any)
            this.ondispose(() => this.node?.removeEventListener(type, listener as any))
        }
        if (this.node) setListener(this.node);
        else this.ondom(setListener);
    }

    override toString(): string {
        return this.parseHTML()
    }

    parseHTML(options?: { children?: string, attr?: string }) {
        let tagname = this.tagname;
        let childrenHTML = options?.children ?? (this.#innerHTML || map(this.protos, proto => `${proto}`).join(''));
        let attr = options?.attr ?? map(_Object_entries(this.#attr), ([key, value]) => value.length ? `${key}="${value}"` : key).join(' ');
        let attrText = attr.length ? ' ' + attr : '';
        if (SELF_CLOSING_TAGNAMES.includes(tagname)) return `<${tagname}${attrText} />`;
        return `<${tagname}${attrText}>${childrenHTML}</${tagname}>`;
    }

    override toDOM(children = true): H[] {
        if (this.node) return [this.node];
        let element = document.createElement(this.tagname) as H;
        this.node = element;
        if (this.#innerHTML) this.node.innerHTML = this.#innerHTML;
        else if (children) element.append(...map(this.protos, proto => proto.toDOM(children)).flat());
        forEach(_Object_entries(this.#attr), ([key, value]) => element.setAttribute(key, value));
        forEach(this.modifiers, process => process(element));
        return [element];
    }

    private attrProcess(attrObj: $.Props) {
        forEach(_Object_entries(attrObj), ([key, value]) => {
            for (let process of $.process.attr) {
                let result = process(key, value, this as any);
                if (!isUndefined(result)) return;
            }
            this.attr(key, value);
        })
    }

    innerHTML(html: string) {
        this.#innerHTML = html;
        if (this.node) this.node.innerHTML = html;
    }

    attr(): Record<string, string>;
    attr(attrName: string): string | null;
    attr(attrName: string, attrValue: string | null): this;
    attr(attrName?: string, attrValue?: string | null) {
        if (!arguments.length) return this.#attr;
        if (isUndefined(attrValue)) return this.#attr[attrName!] ?? _null;
        if (isNull(attrValue)) {
            delete this.#attr[attrName!];
            this.node?.removeAttribute(attrName!);
        }
        else {
            this.#attr[attrName!] = attrValue;
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

    style(declarations: Partial<CSSStyleDeclaration>) {
        let setStyle = () => this.node && _Object_assign(this.node.style, declarations);
        setStyle();
        if (!this.node) this.ondom(setStyle);
    }

    private token(method: 'add' | 'delete', name: string, ...tokens: string[]) {
        let value = this.#attr[name];
        let tokenArr = new Set(value?.split(' ') ?? []);
        forEach(tokens, t => tokenArr[method](t));
        this.#attr[name] = _Array_from(tokenArr).join(' ');
    }
}