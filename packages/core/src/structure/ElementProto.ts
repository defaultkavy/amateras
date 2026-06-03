import { Utils } from '@amateras/utils';
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

    static attrProcess(proto: ElementProto, attrObj: $.Props) {
        Utils.forEach(Utils.entries(attrObj), ([key, value]) => {
            for (let process of $.middleware.attr) {
                let result = process(key, value, proto);
                if (!Utils.isUndefined(result)) return;
            }
            proto.attr(key, value);
        })
    }

    override dispose(): void {
        super.dispose();
        this.layout = null;
    }

    override build(cascading?: boolean): this {
        if (this.__props__) {
            this.props(this.__props__);
            this.__props__ = Utils.Null;
        }
        super.build(cascading);
        return this;
    }

    props({ ...props }: $.Props) {
        let {class: className, ...propsFiltered} = props;
        if (className) this.addClass(...className.split(' '));
        // handle event listener in props
        Utils.forEach(Utils.entries(propsFiltered), ([name, value]) => {
            if (name.startsWith('on') && Utils.isFunction(value)) {
                this.on(name.replace('on', ''), value);
                delete propsFiltered[name];
            }
        })
        ElementProto.attrProcess(this, propsFiltered);
    }

    on<K extends keyof HTMLElementEventMap>(type: K, listener: (event: HTMLElementEventMap[K] & { currentTarget: H }) => void, options?: boolean | AddEventListenerOptions): void
    on(type: string, listener: (event: Event & { currentTarget: H }) => void, options?: boolean | AddEventListenerOptions): void;
    on(type: string, listener: (event: Event & { currentTarget: H }) => void, options?: boolean | AddEventListenerOptions) {
        let setListener = (node: Node) => {
            node.addEventListener(type, listener as any, options)
            this.listen('dispose', () => this.node?.removeEventListener(type, listener as any))
        }
        if (this.node) setListener(this.node);
        this.listen('dom', setListener);
    }

    off<K extends keyof HTMLElementEventMap>(type: K, listener: (event: HTMLElementEventMap[K] & { currentTarget: H }) => void, options?: boolean | AddEventListenerOptions): void
    off(type: string, listener: (event: Event & { currentTarget: H }) => void, options?: boolean | AddEventListenerOptions): void;
    off(type: string, listener: (event: Event & { currentTarget: H }) => void, options?: boolean | AddEventListenerOptions) {
        this.node?.removeEventListener(type, listener as any, options)
    }

    override toString(): string {
        return this.parseHTML();
    }

    parseHTML(options?: { children?: string, attr?: string }) {
        let tagname = this.tagname;
        let childrenHTML = options?.children ?? (this.#innerHTML || Utils.map(this.protos, proto => proto.visible ? `${proto}` : '').join(''));
        let attr = options?.attr ?? Utils.map(Utils.entries(this.#attr), ([key, value]) => value.length ? `${key}="${value}"` : key).join(' ');
        let attrText = attr.length ? ' ' + attr : '';
        if (SELF_CLOSING_TAGNAMES.includes(tagname)) return `<${tagname}${attrText} />`;
        return `<${tagname}${attrText}>${childrenHTML}</${tagname}>`;
    }

    override toDOM(children = true): H[] {
        super.toDOM();
        let initialized = !!this.node;
        let element = this.node ?? document.createElement(this.tagname) as H;
        this.node = element;
        if (children) {
            if (this.#innerHTML && !initialized) this.node.innerHTML = this.#innerHTML;
            else if (!initialized || this.virtual) this.DOMProcess();
        }
        if (!initialized) Utils.forEach(Utils.entries(this.#attr), ([key, value]) => element.setAttribute(key, value));
        if (!initialized) this.dispatch('dom', [this.node])
        return [element];
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
        if (Utils.isUndefined(attrValue)) return this.#attr[attrName!] ?? Utils.Null;
        if (Utils.isNull(attrValue)) {
            delete this.#attr[attrName!];
            this.node?.removeAttribute(attrName!);
        }
        else {
            this.#attr[attrName!] = attrValue;
            this.node?.setAttribute(attrName!, attrValue);
        }
        return this;
    }

    hasAttr(attrName: string) {
        return !Utils.isNull(this.attr(attrName));
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
        if (this.node) Utils.assign(this.node.style, declarations);
        else {
            const oldStyleText = this.attr('style');
            if (oldStyleText) {
                const oldStyle = Utils.fromEntries(oldStyleText.split(';').map(declaration => declaration.split(':') as [string, string]));
                declarations = { ...oldStyle, ...declarations };
            }
            
            this.attr('style', Utils.entries(declarations).map(([name, value]) => `${name}: ${value}`).join('; '));
        }
    }

    private token(method: 'add' | 'delete', name: string, ...tokens: string[]) {
        let value = this.#attr[name];
        let tokenArr = new Set(value?.split(' ') ?? []);
        Utils.forEach(tokens, t => tokenArr[method](t));
        this.#attr[name] = Utils.arrayFrom(tokenArr).join(' ');
    }
}