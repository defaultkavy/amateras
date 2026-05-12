import { _Array_from, _null, _Object_assign, _Object_entries, forEach, isFunction, isNull, isUndefined, map } from "@amateras/utils";
import { NodeProto } from "./NodeProto";
import { symbol_ProtoType } from "#lib/symbols";

const SELF_CLOSING_TAGNAMES = ['img', 'hr', 'br', 'input', 'link', 'meta'];
export interface ElementProtoConstructor extends Constructor<ElementProto> {
    [symbol_ProtoType]: 'Element'
}

export class ElementProto<H extends HTMLElement = HTMLElement> extends NodeProto<H> {
    tagname: string;
    #attr: Record<string, string> = {};
    static override readonly [symbol_ProtoType] = 'Element' as any;
    declare layout: $.Layout | null;
    #innerHTML = '';
    private __props__: $.Props | null;
    constructor(tagname: string, props: $.Props<any, any> | null, layout?: $.Layout | null) {
        super(() => layout?.(this));
        this.tagname = tagname;
        this.__props__ = props;
    }

    override dispose(): void {
        super.dispose();
        this.layout = null;
    }

    override build(cascading?: boolean): this {
        if (this.__props__) {
            this.props(this.__props__);
            this.__props__ = _null;
        }
        super.build(cascading);
        return this;
    }

    props({ ...props }: $.Props) {
        let {class: className, ...propsFiltered} = props;
        if (className) this.addClass(...className.split(' '));
        // handle event listener in props
        forEach(_Object_entries(propsFiltered), ([name, value]) => {
            if (name.startsWith('on') && isFunction(value)) {
                this.on(name.replace('on', ''), value);
                delete propsFiltered[name];
            }
        })
        this.attrProcess(propsFiltered);
    }

    on<K extends keyof HTMLElementEventMap>(type: K, listener: (event: HTMLElementEventMap[K] & { currentTarget: H }) => void, options?: boolean | AddEventListenerOptions): void
    on(type: string, listener: (event: Event & { currentTarget: H }) => void, options?: boolean | AddEventListenerOptions): void;
    on(type: string, listener: (event: Event & { currentTarget: H }) => void, options?: boolean | AddEventListenerOptions) {
        let setListener = (node: Node) => {
            node.addEventListener(type, listener as any, options)
            this.listen('dispose', () => this.node?.removeEventListener(type, listener as any))
        }
        if (this.node) setListener(this.node);
        else this.listen('dom', setListener);
    }

    override toString(): string {
        return this.parseHTML();
    }

    parseHTML(options?: { children?: string, attr?: string }) {
        let tagname = this.tagname;
        let childrenHTML = options?.children ?? (this.#innerHTML || map(this.protos, proto => proto.visible ? `${proto}` : '').join(''));
        let attr = options?.attr ?? map(_Object_entries(this.#attr), ([key, value]) => value.length ? `${key}="${value}"` : key).join(' ');
        let attrText = attr.length ? ' ' + attr : '';
        if (SELF_CLOSING_TAGNAMES.includes(tagname)) return `<${tagname}${attrText} />`;
        return `<${tagname}${attrText}>${childrenHTML}</${tagname}>`;
    }

    override toDOM(children = true): H[] {
        super.toDOM();
        let element = this.node ?? document.createElement(this.tagname) as H;
        this.node = element;
        if (this.#innerHTML && this.node.innerHTML !== this.#innerHTML) this.node.innerHTML = this.#innerHTML;
        else if (children) this.DOMProcess();
        forEach(_Object_entries(this.#attr), ([key, value]) => element.setAttribute(key, value));
        this.dispatch('dom', [this.node])
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