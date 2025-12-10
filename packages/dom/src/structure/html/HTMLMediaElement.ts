import { assignAttributes } from "#lib/assignAttributes";
import { HTMLElement } from "#structure/HTMLElement";
import { _Object_assign } from "@amateras/utils";

export class HTMLMediaElement extends HTMLElement {
    static defaultAttributes = {
        ...HTMLElement.defaultAttributes,
        autoplay: false,
        buffered: '',
        controls: false,
        controlsList: '',
        crossOrigin: '',
        currentSrc: '',
        currentTime: 0,
        defaultMuted: false,
        defaultPlaybackRate: 1,
        disableRemotePlayback: false,
        duration: NaN,
        ended: false,
        error: null,
        loop: false,
        mediaKeys: null,
        muted: false,
        networkState: 0,
        paused: true,
        playbackRate: 1,
        played: '',
        preload: 'metadata',
        preservesPitch: true,
        readyState: 0,
        remote: null,
        seekable: '',
        seeking: false,
        sinkId: '',
        src: '',
        srcObject: null,
        textTracks: null,
        videoTracks: null,
        volume: 1
    }

    constructor(tag: string = 'audio') {
        super(tag)
    }
}

assignAttributes(HTMLMediaElement, HTMLMediaElement.defaultAttributes)
_Object_assign(globalThis, { HTMLMediaElement })
