import { _Array_from, _instanceof, _Object_assign, _Object_entries, _Object_fromEntries, forEach, isNull, isString, isUndefined } from "#lib/native";
import { _document } from "#lib/env";
import { $Node } from "./$Node";

export class $Element<Ele extends Element = Element, EvMap = ElementEventMap> extends $Node<EvMap> {
    declare node: Ele
    constructor(resolver: Ele | string) {
        super(_instanceof(resolver, Element) ? resolver : createNode(resolver) as unknown as Ele)
        //@ts-expect-error
        this.node.$ = this;
    }

    attr(): {[key: string]: string};
    attr(key: string): string | null;
    attr(obj: {[key: string]: $Parameter<any| null>}): this;
    attr(resolver?: {[key: string]: $Parameter<any | null>} | string) {
        if (!arguments.length) return _Object_fromEntries(_Array_from(this.attributes).map(attr => [attr.name, attr.value]));
        if (isString(resolver)) return this.getAttribute(resolver);
        if (resolver) 
            keyIterate: for (let [key, value] of _Object_entries(resolver)) {
                const set = (value: string | number | boolean | null | undefined) => {
                    if (!isUndefined(value) && isNull(value)) this.removeAttribute(key);
                    else this.setAttribute(key, `${value}`);
                }
                for (const setter of $Node.setters) {
                    const result = setter(value, set);
                    if (!isUndefined(result)) { set(result); continue keyIterate; }
                }
                set(value as any);
            }
        return this;
    }

    class(...token: (string | null | undefined)[]) {
        return this.classList(token.filter(isString).join(' '));
    }

    addClass(...token: (string | null | undefined)[]) {
        this.classList().add(...token.filter(isString));
        return this;
    }
    
    removeClass(...token: (string | null | undefined)[]) {
        this.classList().remove(...token.filter(isString));
        return this;
    }

    toString() {
        return this.outerHTML();
    }
}

function createNode(nodeName: string) {
    return !_document 
    //@ts-expect-error
    ? new Node(nodeName) as unknown as Node & ChildNode 
    : _document.createElement(nodeName);
}

export interface $Element<Ele extends Element, EvMap = ElementEventMap> {
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
    /** {@link Element.nextElementSibling} */
    readonly nextElementSibling: Element | null;
    /** {@link Element.previousElementSibling} */
    readonly previousElementSibling: Element | null;
    /** {@link Element.childElementCount} */
    readonly childElementCount: number;
    /** {@link Element.children} */
    readonly children: HTMLCollection;
    /** {@link Element.firstElementChild} */
    readonly firstElementChild: Element | null;
    /** {@link Element.lastElementChild} */
    readonly lastElementChild: Element | null;
    /** {@link Element.assignedSlot} */
    readonly assignedSlot: HTMLSlotElement | null;

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
    /** {@link Element.animate} */
    animate(keyframes: Keyframe[] | PropertyIndexedKeyframes | null, options?: number | KeyframeAnimationOptions): Animation;
    /** {@link Element.getAnimations} */
    getAnimations(options?: GetAnimationsOptions): Animation[];

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

    // ARIAMixin
    /** {@link ARIAMixin.ariaAtomic} */
    ariaAtomic(): string | null;
    ariaAtomic(ariaAtomic: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaAutoComplete} */
    ariaAutoComplete(): string | null;
    ariaAutoComplete(ariaAutoComplete: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaBrailleLabel} */
    ariaBrailleLabel(): string | null;
    ariaBrailleLabel(ariaBrailleLabel: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaBrailleRoleDescription} */
    ariaBrailleRoleDescription(): string | null;
    ariaBrailleRoleDescription(ariaBrailleRoleDescription: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaBusy} */
    ariaBusy(): string | null;
    ariaBusy(ariaBusy: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaChecked} */
    ariaChecked(): string | null;
    ariaChecked(ariaChecked: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaColCount} */
    ariaColCount(): string | null;
    ariaColCount(ariaColCount: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaColIndex} */
    ariaColIndex(): string | null;
    ariaColIndex(ariaColIndex: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaColIndexText} */
    ariaColIndexText(): string | null;
    ariaColIndexText(ariaColIndexText: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaColSpan} */
    ariaColSpan(): string | null;
    ariaColSpan(ariaColSpan: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaCurrent} */
    ariaCurrent(): string | null;
    ariaCurrent(ariaCurrent: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaDescription} */
    ariaDescription(): string | null;
    ariaDescription(ariaDescription: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaDisabled} */
    ariaDisabled(): string | null;
    ariaDisabled(ariaDisabled: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaExpanded} */
    ariaExpanded(): string | null;
    ariaExpanded(ariaExpanded: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaHasPopup} */
    ariaHasPopup(): string | null;
    ariaHasPopup(ariaHasPopup: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaHidden} */
    ariaHidden(): string | null;
    ariaHidden(ariaHidden: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaInvalid} */
    ariaInvalid(): string | null;
    ariaInvalid(ariaInvalid: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaKeyShortcuts} */
    ariaKeyShortcuts(): string | null;
    ariaKeyShortcuts(ariaKeyShortcuts: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaLabel} */
    ariaLabel(): string | null;
    ariaLabel(ariaLabel: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaLevel} */
    ariaLevel(): string | null;
    ariaLevel(ariaLevel: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaLive} */
    ariaLive(): string | null;
    ariaLive(ariaLive: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaModal} */
    ariaModal(): string | null;
    ariaModal(ariaModal: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaMultiLine} */
    ariaMultiLine(): string | null;
    ariaMultiLine(ariaMultiLine: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaMultiSelectable} */
    ariaMultiSelectable(): string | null;
    ariaMultiSelectable(ariaMultiSelectable: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaOrientation} */
    ariaOrientation(): string | null;
    ariaOrientation(ariaOrientation: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaPlaceholder} */
    ariaPlaceholder(): string | null;
    ariaPlaceholder(ariaPlaceholder: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaPosInSet} */
    ariaPosInSet(): string | null;
    ariaPosInSet(ariaPosInSet: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaPressed} */
    ariaPressed(): string | null;
    ariaPressed(ariaPressed: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaReadOnly} */
    ariaReadOnly(): string | null;
    ariaReadOnly(ariaReadOnly: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaRelevant} */
    ariaRelevant(): string | null;
    ariaRelevant(ariaRelevant: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaRequired} */
    ariaRequired(): string | null;
    ariaRequired(ariaRequired: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaRoleDescription} */
    ariaRoleDescription(): string | null;
    ariaRoleDescription(ariaRoleDescription: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaRowCount} */
    ariaRowCount(): string | null;
    ariaRowCount(ariaRowCount: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaRowIndex} */
    ariaRowIndex(): string | null;
    ariaRowIndex(ariaRowIndex: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaRowIndexText} */
    ariaRowIndexText(): string | null;
    ariaRowIndexText(ariaRowIndexText: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaRowSpan} */
    ariaRowSpan(): string | null;
    ariaRowSpan(ariaRowSpan: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaSelected} */
    ariaSelected(): string | null;
    ariaSelected(ariaSelected: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaSetSize} */
    ariaSetSize(): string | null;
    ariaSetSize(ariaSetSize: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaSort} */
    ariaSort(): string | null;
    ariaSort(ariaSort: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaValueMax} */
    ariaValueMax(): string | null;
    ariaValueMax(ariaValueMax: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaValueMin} */
    ariaValueMin(): string | null;
    ariaValueMin(ariaValueMin: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaValueNow} */
    ariaValueNow(): string | null;
    ariaValueNow(ariaValueNow: $Parameter<string | null>): this;
    /** {@link ARIAMixin.ariaValueText} */
    ariaValueText(): string | null;
    ariaValueText(ariaValueText: $Parameter<string | null>): this;
    /** {@link ARIAMixin.role} */
    role(): string | null;
    role(role: $Parameter<string | null>): this;
}