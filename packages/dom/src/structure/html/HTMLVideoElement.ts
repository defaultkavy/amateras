import { assignAttributes } from "#lib/assignAttributes";
import { HTMLMediaElement } from "#structure/html/HTMLMediaElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLVideoElement extends HTMLMediaElement {
    static defaultAttributes = {
        ...HTMLMediaElement.defaultAttributes,
        disablePictureInPicture: false,
        height: '',
        poster: '',
        videoHeight: 0,
        videoWidth: 0,
        width: ''
    }

    constructor() {
        super('video')
    }
}

assignAttributes(HTMLVideoElement, HTMLVideoElement.defaultAttributes)
_Object_assign(globalThis, { HTMLVideoElement })
