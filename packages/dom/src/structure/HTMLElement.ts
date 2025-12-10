import { _Array_from, _Object_assign, _Object_entries } from "@amateras/utils";
import { Element } from "./Element";
import { assignAttributes } from "#lib/assignAttributes";

export class HTMLElement extends Element {
    #style: Partial<CSSStyleDeclaration> = {}

    static defaultAttributes = {
        ...Element.defaultAttributes,
        autocapitalize: false,
        dir: '',
        draggable: false,
        hidden: false,
        inert: [false, ''],
        lang: '',
        popover: null,
        spellcheck: true,
        title: '',
        translate: [true, 'yes', 'no'],
        writingSuggestions: 'true',
    }
    
    get attributes() {
        const style = _Object_entries(this.#style).filter(([_, value]) => value).map(([key, value]) => `${key}:${value}`).join(';')
        const attrs = super.attributes;
        if (style) attrs.push({name: 'style', value: style})
        return attrs
    }

    get style() { return this.#style }
}

assignAttributes(HTMLElement, HTMLElement.defaultAttributes)
_Object_assign(globalThis, { HTMLElement })