import { $HTMLElement } from "#node/$HTMLElement";

export class $TextArea extends $HTMLElement<HTMLTextAreaElement> {
    constructor() {
        super('textarea')
    }
}

export interface $TextArea extends $HTMLElement<HTMLTextAreaElement> {}