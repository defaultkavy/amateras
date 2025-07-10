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
        if (!arguments.length) return _Object_fromEntries(_Array_from(this.attributes).map(attr => [attr.name, attr.value]));
        if (isString(resolver)) return this.getAttribute(resolver);
        if (resolver) for (let [key, value] of _Object_entries(resolver)) {
            const set = (value: any) => !isUndefined(value) && this.setAttribute(key, `${value}`)
            if (_instanceof(value, Signal)) value = value.subscribe(set).value();
            set(value);
        }
        return this;
    }

    class(...token: string[]) {
        this.classList(token.join(' '));
        return this;
    }

    addClass(...token: string[]) {
        this.classList().add(...token);
        return this;
    }
    
    removeClass(...token: string[]) {
        this.classList().remove(...token);
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
        return this.outerHTML();
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

    /** {@link Element.attachShadow} */
    attachShadow(init: ShadowRootInit): ShadowRoot;
    /** {@link Element.checkVisibility} */
    checkVisibility(options?: CheckVisibilityOptions): boolean;
    /** {@link Element.closest} */
    closest<K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K] | null;
    closest<K extends keyof SVGElementTagNameMap>(selector: K): SVGElementTagNameMap[K] | null;
    closest<K extends keyof MathMLElementTagNameMap>(selector: K): MathMLElementTagNameMap[K] | null;
    closest<E extends Element = Element>(selectors: string): E | null;
    /** {@link Element.computedStyleMap} */
    computedStyleMap(): StylePropertyMapReadOnly;
    /** {@link Element.getAttribute} */
    getAttribute(qualifiedName: string): string | null;
    /** {@link Element.getAttributeNS} */
    getAttributeNS(namespace: string | null, localName: string): string | null;
    /** {@link Element.getAttributeNames} */
    getAttributeNames(): string[];
    /** {@link Element.getAttributeNode} */
    getAttributeNode(qualifiedName: string): Attr | null;
    /** {@link Element.getAttributeNodeNS} */
    getAttributeNodeNS(namespace: string | null, localName: string): Attr | null;
    /** {@link Element.getBoundingClientRect} */
    getBoundingClientRect(): DOMRect;
    /** {@link Element.getClientRects} */
    getClientRects(): DOMRectList;
    /** {@link Element.getElementsByClassName} */
    getElementsByClassName(classNames: string): HTMLCollectionOf<Element>;
    /** {@link Element.getElementsByTagName} */
    getElementsByTagName<K extends keyof HTMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
    getElementsByTagName<K extends keyof SVGElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<SVGElementTagNameMap[K]>;
    getElementsByTagName<K extends keyof MathMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<MathMLElementTagNameMap[K]>;
    getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
    /** {@link Element.getElementsByTagNameNS} */
    getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1999/xhtml", localName: string): HTMLCollectionOf<HTMLElement>;
    getElementsByTagNameNS(namespaceURI: "http://www.w3.org/2000/svg", localName: string): HTMLCollectionOf<SVGElement>;
    getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1998/Math/MathML", localName: string): HTMLCollectionOf<MathMLElement>;
    getElementsByTagNameNS(namespace: string | null, localName: string): HTMLCollectionOf<Element>;
    /** {@link Element.getHTML} */
    getHTML(options?: GetHTMLOptions): string;
    /** {@link Element.hasAttribute} */
    hasAttribute(qualifiedName: string): boolean;
    /** {@link Element.hasAttributeNS} */
    hasAttributeNS(namespace: string | null, localName: string): boolean;
    /** {@link Element.hasAttributes} */
    hasAttributes(): boolean;
    /** {@link Element.hasPointerCapture} */
    hasPointerCapture(pointerId: number): boolean;
    /** {@link Element.insertAdjacentElement} */
    insertAdjacentElement(where: InsertPosition, element: Element): Element | null;
    /** {@link Element.insertAdjacentHTML} */
    insertAdjacentHTML(position: InsertPosition, string: string): this;
    /** {@link Element.insertAdjacentText} */
    insertAdjacentText(where: InsertPosition, data: string): this;
    /** {@link Element.matches} */
    matches(selectors: string): boolean;
    /** {@link Element.releasePointerCapture} */
    releasePointerCapture(pointerId: number): this;
    /** {@link Element.removeAttribute} */
    removeAttribute(qualifiedName: string): this;
    /** {@link Element.removeAttributeNS} */
    removeAttributeNS(namespace: string | null, localName: string): this;
    /** {@link Element.removeAttributeNode} */
    removeAttributeNode(attr: Attr): Attr;
    /** {@link Element.requestFullscreen} */
    requestFullscreen(options?: FullscreenOptions): Promise<this>;
    /** {@link Element.requestPointerLock} */
    requestPointerLock(options?: PointerLockOptions): Promise<this>;
    /** {@link Element.scroll} */
    scroll(options?: ScrollToOptions): this;
    scroll(x: number, y: number): this;
    /** {@link Element.scrollBy} */
    scrollBy(options?: ScrollToOptions): this;
    scrollBy(x: number, y: number): this;
    /** {@link Element.scrollIntoView} */
    scrollIntoView(arg?: boolean | ScrollIntoViewOptions): this;
    /** {@link Element.scrollTo} */
    scrollTo(options?: ScrollToOptions): this;
    scrollTo(x: number, y: number): this;
    /** {@link Element.setAttribute} */
    setAttribute(qualifiedName: string, value: string): this;
    /** {@link Element.setAttributeNS} */
    setAttributeNS(namespace: string | null, qualifiedName: string, value: string): this;
    /** {@link Element.setAttributeNode} */
    setAttributeNode(attr: Attr): Attr | null;
    /** {@link Element.setAttributeNodeNS} */
    setAttributeNodeNS(attr: Attr): Attr | null;
    /** {@link Element.setHTMLUnsafe} */
    setHTMLUnsafe(html: string): this;
    /** {@link Element.setPointerCapture} */
    setPointerCapture(pointerId: number): this;
    /** {@link Element.toggleAttribute} */
    toggleAttribute(qualifiedName: string, force?: boolean): boolean;

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