import { Signal } from "#structure/Signal";
import { $Node } from "#node/$Node";
import { _Array_from, _instanceof, _Object_assign, _Object_entries, _Object_fromEntries, isFunction, isString, isUndefined } from "#lib/native";

export class $Element<Ele extends Element = Element> extends $Node {
    declare node: Ele
    constructor(resolver: Ele | string) {
        super(_instanceof(resolver, Element) ? resolver : createNode(resolver) as unknown as Ele)
        //@ts-expect-error
        this.node.$ = this;
    }

    attr(): {[key: string]: string};
    attr(key: string): string | null;
    attr(obj: {[key: string]: string | number | boolean | Signal<any>}): this;
    attr(resolver?: {[key: string]: string | number | boolean | Signal<any>} | string) {
        if (!arguments.length) return _Object_fromEntries(_Array_from(this.node.attributes).map(attr => [attr.name, attr.value]));
        if (isString(resolver)) return this.node.getAttribute(resolver);
        if (resolver) for (let [key, value] of _Object_entries(resolver)) {
            const set = (value: any) => !isUndefined(value) && this.node.setAttribute(key, `${value}`)
            if (_instanceof(value, Signal)) value = value.subscribe(set).value();
            set(value);
        }
        return this;
    }

    class(...token: string[]) {
        this.node.classList = token.join(' ');
        return this;
    }

    addClass(...token: string[]) {
        this.node.classList.add(...token);
        return this;
    }
    
    removeClass(...token: string[]) {
        this.node.classList.remove(...token);
        return this;
    }

    use(callback: ($ele: this) => void) {
        callback(this);
        return this;
    }

    on<K extends keyof HTMLElementEventMap>(type: K, listener: $EventListener<Ele> | $EventListenerObject<Ele>, options?: boolean | AddEventListenerOptions) {
        this.node.addEventListener(type, listener as EventListener, options);
        return this;
    }

    off<K extends keyof HTMLElementEventMap>(type: K, listener: $EventListener<Ele> | $EventListenerObject<Ele>, options?: boolean | EventListenerOptions) {
        this.node.removeEventListener(type, listener as EventListener, options);
        return this;
    }
    
    once<K extends keyof HTMLElementEventMap>(type: K, listener: $EventListener<Ele> | $EventListenerObject<Ele>, options?: boolean | AddEventListenerOptions) {
        const handler = (event: Event) => {
            this.off(type, handler, options);
            isFunction(listener) ? listener(event as any) : listener.handleEvent(event as any);
        }
        this.on(type, handler, options);
        return this;
    }

    toString() {
        return this.node.outerHTML;
    }
}

export type $Event<E extends Element> = Event & {target: E};
export type $EventListener<E extends Element> = (event: $Event<E>) => void;
export type $EventListenerObject<E extends Element> = { handleEvent(object: $Event<E>): void; }

function createNode(nodeName: string) {
    //@ts-expect-error
    return !document ? new Node(nodeName) as unknown as Node & ChildNode : document.createElement(nodeName);
}

export interface $Element<Ele extends Element> {
    /** {@link Element.attributes} */
    readonly attributes: NamedNodeMap;
    /** {@link Element.clientHeight} */
    readonly clientHeight: number;
    /** {@link Element.clientLeft} */
    readonly clientLeft: number;
    /** {@link Element.clientTop} */
    readonly clientTop: number;
    /** {@link Element.clientWidth} */
    readonly clientWidth: number;
    /** {@link Element.currentCSSZoom} */
    readonly currentCSSZoom: number;
    /** {@link Element.localName} */
    readonly localName: string;
    /** {@link Element.namespaceURI} */
    readonly namespaceURI: string | null;
    /** {@link Element.prefix} */
    readonly prefix: string | null;
    /** {@link Element.ownerDocument} */
    readonly ownerDocument: Document;
    /** {@link Element.scrollHeight} */
    readonly scrollHeight: number;
    /** {@link Element.scrollWidth} */
    readonly scrollWidth: number;
    /** {@link Element.shadowRoot} */
    readonly shadowRoot: ShadowRoot | null;
    /** {@link Element.tagName} */
    readonly tagName: string;

    /** {@link Element.classList} */
    classList(): DOMTokenList;
    classList(value: $Parameter<string>): this;
    /** {@link Element.className} */
    className(): string;
    className(value: $Parameter<string>): this;
    /** {@link Element.id} */
    id(): string;
    id(id: $Parameter<string>): this;
    /** {@link Element.innerHTML} */
    innerHTML(): string;
    innerHTML(innerHTML: $Parameter<string>): this;
    /** {@link Element.outerHTML} */
    outerHTML(): string;
    outerHTML(outerHTML: $Parameter<string>): this;
    /** {@link Element.part} */
    part(): DOMTokenList;
    part(part: $Parameter<string>): this;
    /** {@link Element.scrollLeft} */
    scrollLeft(): number;
    scrollLeft(scrollLeft: $Parameter<number>): this;
    /** {@link Element.scrollTop} */
    scrollTop(): number;
    scrollTop(scrollTop: $Parameter<number>): this;
    /** {@link Element.slot} */
    slot(): string;
    slot(slot: $Parameter<string>): this;
}