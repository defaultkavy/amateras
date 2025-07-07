import { assignHelper } from "#lib/assignHelper";
import { $HTMLElement } from "#node/$HTMLElement";

export class $Media extends $HTMLElement<HTMLMediaElement> {
    constructor() {
        super('media')
    }
}

export interface $Media extends $HTMLElement<HTMLMediaElement> {}

assignHelper(HTMLMediaElement, $Media, 'media');

declare module '#core' {
    export function $(nodeName: 'media'): $Media
}