import type { $HTMLElement } from "./$HTMLElement";
import type { Signal } from "#structure/Signal";

type $Parameter<T> = T | undefined | Signal<T> | Signal<T | undefined>

declare module '#node/$Element' {
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
}

export interface $Input extends $HTMLElement<HTMLInputElement> {}
export interface $Anchor extends $HTMLElement<HTMLAnchorElement> {}
export interface $Image extends $HTMLElement<HTMLImageElement> {
    src(src: string): this;
    src(): string;
}
export interface $Canvas extends $HTMLElement<HTMLCanvasElement> {}
export interface $Dialog extends $HTMLElement<HTMLDialogElement> {}
export interface $Form extends $HTMLElement<HTMLFormElement> {}
export interface $Label extends $HTMLElement<HTMLLabelElement> {}
export interface $Media extends $HTMLElement<HTMLMediaElement> {}
export interface $Select extends $HTMLElement<HTMLSelectElement> {}
export interface $Option extends $HTMLElement<HTMLOptionElement> {}
export interface $OptGroup extends $HTMLElement<HTMLOptGroupElement> {}
export interface $TextArea extends $HTMLElement<HTMLTextAreaElement> {}

declare module '#core' {
    export function $(tagname: 'input'): $Input
    export function $(tagname: 'anchor'): $Anchor
    export function $(tagname: 'img'): $Image
    export function $(tagname: 'dialog'): $Dialog
    export function $(tagname: 'form'): $Form
    export function $(tagname: 'label'): $Label
    export function $(tagname: 'media'): $Media
    export function $(tagname: 'select'): $Select
    export function $(tagname: 'option'): $Option
    export function $(tagname: 'otpgroup'): $OptGroup
    export function $(tagname: 'textarea'): $TextArea
    export function $(tagname: string): $HTMLElement
}