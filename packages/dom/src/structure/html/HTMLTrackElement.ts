import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLTrackElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        default: false,
        kind: 'subtitles',
        label: '',
        src: '',
        srclang: ''
    }

    constructor() {
        super('track')
    }
}

assignAttributes(HTMLTrackElement, HTMLTrackElement.defaultAttributes)
_Object_assign(globalThis, { HTMLTrackElement })
