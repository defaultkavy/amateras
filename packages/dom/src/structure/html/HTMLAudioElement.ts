import { assignAttributes } from "#lib/assignAttributes";
import { HTMLMediaElement } from "#structure/html/HTMLMediaElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLAudioElement extends HTMLMediaElement {
    static defaultAttributes = {
        ...HTMLMediaElement.defaultAttributes
    }

    constructor() {
        super('audio')
    }
}

assignAttributes(HTMLAudioElement, HTMLAudioElement.defaultAttributes)
_Object_assign(globalThis, { HTMLAudioElement })
