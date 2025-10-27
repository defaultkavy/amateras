import { _Object_entries, forEach } from "@amateras/utils";
import { $Element } from "#node/$Element";

export class $HTMLElement<Ele extends HTMLElement = HTMLElement, EvMap = HTMLElementEventMap> extends $Element<Ele, EvMap> {
    constructor(resolver: string | Ele) {
        super(resolver);
    }
    
    style(): CSSStyleDeclaration;
    style(style: Partial<CSSStyleDeclarationOptions> | undefined): this
    style(style?: Partial<CSSStyleDeclarationOptions> | undefined) {
        let _style = this.node.style
        if (!arguments.length) return _style
        if (style) forEach(_Object_entries(style), ([key, value]) => _style[key as any] = value ?? '');
        return this;
    }
}

type CSSStyleDeclarationOptions = Omit<CSSStyleDeclaration, 'parentRule' | 'length' | 'getPropertyPriority' | 'getPropertyValue' | 'item' | 'removeProperty' | 'setProperty'>;

export interface $HTMLElement<Ele extends HTMLElement = HTMLElement, EvMap = HTMLElementEventMap> extends $Element<Ele, EvMap> {
    /** {@link HTMLElement.accessKeyLabel} */
    readonly accessKeyLabel: string;
    /** {@link HTMLElement.offsetHeight} */
    readonly offsetHeight: number;
    /** {@link HTMLElement.offsetLeft} */
    readonly offsetLeft: number;
    /** {@link HTMLElement.offsetParent} */
    readonly offsetParent: Element | null;
    /** {@link HTMLElement.offsetTop} */
    readonly offsetTop: number;
    /** {@link HTMLElement.offsetWidth} */
    readonly offsetWidth: number;
    /** {@link HTMLElement.isContentEditable} */
    readonly isContentEditable: boolean;

    /** {@link HTMLElement.attachInternals} */
    attachInternals(): ElementInternals;
    /** {@link HTMLElement.click} */
    click(): this;
    /** {@link HTMLElement.hidePopover} */
    hidePopover(): this;
    /** {@link HTMLElement.showPopover} */
    showPopover(): this;
    /** {@link HTMLElement.togglePopover} */
    togglePopover(options?: boolean): boolean;

    /** {@link HTMLElement.accessKey} */
    accessKey(): string;
    accessKey(accessKey: $Parameter<string>): this;
    /** {@link HTMLElement.autocapitalize} */
    autocapitalize(): string;
    autocapitalize(autocapitalize: $Parameter<string>): this;
    /** {@link HTMLElement.dir} */
    dir(): string;
    dir(dir: $Parameter<string>): this;
    /** {@link HTMLElement.draggable} */
    draggable(): boolean;
    draggable(draggable: $Parameter<boolean>): this;
    /** {@link HTMLElement.hidden} */
    hidden(): boolean;
    hidden(hidden: $Parameter<boolean>): this;
    /** {@link HTMLElement.inert} */
    inert(): boolean;
    inert(inert: $Parameter<boolean>): this;
    /** {@link HTMLElement.innerText} */
    innerText(): string;
    innerText(innerText: $Parameter<string>): this;
    /** {@link HTMLElement.lang} */
    lang(): string;
    lang(lang: $Parameter<string>): this;
    /** {@link HTMLElement.outerText} */
    outerText(): string;
    outerText(outerText: $Parameter<string>): this;
    /** {@link HTMLElement.popover} */
    popover(): string | null;
    popover(popover: $Parameter<string | null>): this;
    /** {@link HTMLElement.spellcheck} */
    spellcheck(): boolean;
    spellcheck(spellcheck: $Parameter<boolean>): this;
    /** {@link HTMLElement.title} */
    title(): string;
    title(title: $Parameter<string>): this;
    /** {@link HTMLElement.translate} */
    translate(): string;
    translate(translate: $Parameter<boolean>): this;
    /** {@link HTMLElement.writingSuggestions} */
    writingSuggestions(): string;
    writingSuggestions(writingSuggestions: $Parameter<string>): this;
    /** {@link HTMLElement.contentEditable} */
    contentEditable(): string;
    contentEditable(contentEditable: $Parameter<string>): this;
    /** {@link HTMLElement.enterKeyHint} */
    enterKeyHint(): string;
    enterKeyHint(enterKeyHint: $Parameter<string>): this;
    /** {@link HTMLElement.inputMode} */
    inputMode(): string;
    inputMode(inputMode: $Parameter<string>): this;
}