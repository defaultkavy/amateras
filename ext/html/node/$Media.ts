import { $HTMLElement } from "#node/$HTMLElement";

export class $Media extends $HTMLElement<HTMLMediaElement> {
    constructor() {
        super('media')
    }
}

export interface $Media extends $HTMLElement<HTMLMediaElement> {}