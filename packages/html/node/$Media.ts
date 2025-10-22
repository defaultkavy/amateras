import { assignProperties } from "#lib/assignProperties";
import { $HTMLElement } from "#node/$HTMLElement";

export class $Media extends $HTMLElement<HTMLMediaElement> {
    constructor() {
        super('media')
    }
}

export interface $Media extends $HTMLElement<HTMLMediaElement> {}

assignProperties(HTMLMediaElement, $Media, 'media');

declare module '#core' {
    export function $(nodeName: 'media'): $Media
}