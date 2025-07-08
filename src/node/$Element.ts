import { Signal } from "#structure/Signal";
import { $Node } from "#node/$Node";
import { _Array_from, _instanceof, _Object_assign, _Object_entries, _Object_fromEntries, isFunction, isString, isUndefined } from "#lib/native";

export class $Element<Ele extends Element = Element, EvMap = ElementEventMap> extends $Node {
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

    on<K extends keyof EvMap, Ev extends EvMap[K]>(type: K, listener: $EventListener<this, Ev> | $EventListenerObject<this, Ev>, options?: boolean | AddEventListenerOptions) {
        this.node.addEventListener(type as string, listener as any, options);
        return this;
    }

    off<K extends keyof EvMap, Ev extends EvMap[K]>(type: K, listener: $EventListener<this, Ev> | $EventListenerObject<this, Ev>, options?: boolean | EventListenerOptions) {
        this.node.removeEventListener(type as string, listener as any, options);
        return this;
    }
    
    once<K extends keyof EvMap, Ev extends EvMap[K]>(type: K, listener: $EventListener<this, Ev> | $EventListenerObject<this, Ev>, options?: boolean | AddEventListenerOptions) {
        const handler = (event: $Event<any>) => {
            this.off(type, handler, options);
            isFunction(listener) ? listener(event) : listener.handleEvent(event);
        }
        this.on(type, handler, options);
        return this;
    }

    toString() {
        return this.node.outerHTML;
    }
}

export type EventMap = {[key: string]: Event}
export type $Event<E extends $Element, Ev = any> = Ev & {target: {$: E}};
export type $EventListener<E extends $Element, Ev> = (event: $Event<E, Ev>) => void;
export type $EventListenerObject<E extends $Element, Ev> = { handleEvent(object: $Event<E, Ev>): void; }

function createNode(nodeName: string) {
    //@ts-expect-error
    return !document ? new Node(nodeName) as unknown as Node & ChildNode : document.createElement(nodeName);
}

export interface $Element<Ele extends Element, EvMap> {
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

    on(type: string, listener: $EventListener<this, Event> | $EventListenerObject<this, Event>, options?: boolean | AddEventListenerOptions): this;
    on<K extends keyof EvMap, Ev extends EvMap[K]>(type: K, listener: $EventListener<this, Ev> | $EventListenerObject<this, Ev>, options?: boolean | AddEventListenerOptions): this;

    off(type: string, listener: $EventListener<this, Event> | $EventListenerObject<this, Event>, options?: boolean | EventListenerOptions): this;
    off<K extends keyof EvMap, Ev extends EvMap[K]>(type: K, listener: $EventListener<this, Ev> | $EventListenerObject<this, Ev>, options?: boolean | EventListenerOptions): this;

    once(type: string, listener: $EventListener<this, Event> | $EventListenerObject<this, Event>, options?: boolean | AddEventListenerOptions): this;
    once<K extends keyof EvMap, Ev extends EvMap[K]>(type: K, listener: $EventListener<this, Ev> | $EventListenerObject<this, Ev>, options?: boolean | AddEventListenerOptions): this;
}