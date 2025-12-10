import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLImageElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        alt: '',
        border: '',
        complete: false,
        crossOrigin: '',
        currentSrc: '',
        decoding: 'auto',
        fetchPriority: 'auto',
        height: '',
        isMap: false,
        loading: 'eager',
        longDesc: '',
        name: '',
        naturalHeight: 0,
        naturalWidth: 0,
        referrerPolicy: '',
        sizes: '',
        src: '',
        srcSet: '',
        useMap: '',
        width: '',
        x: 0,
        y: 0
    }

    constructor() {
        super('img')
    }
}

assignAttributes(HTMLImageElement, HTMLImageElement.defaultAttributes)
_Object_assign(globalThis, { HTMLImageElement })
