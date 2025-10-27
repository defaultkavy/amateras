import { assignProperties } from "@amateras/core/lib/assignProperties";
import { $HTMLElement } from "@amateras/core/node/$HTMLElement";

export class $Media extends $HTMLElement<HTMLMediaElement> {
    constructor() {
        super('media')
    }
}

export interface $Media extends $HTMLElement<HTMLMediaElement> {}

assignProperties(HTMLMediaElement, $Media, 'media');

declare module "@amateras/core" {
    export function $(nodeName: 'media'): $Media
}