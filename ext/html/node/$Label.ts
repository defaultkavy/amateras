import { $HTMLElement } from "#node/$HTMLElement";

export class $Label extends $HTMLElement<HTMLLabelElement> {
    constructor() {
        super('label')
    }
}

export interface $Label extends $HTMLElement<HTMLLabelElement> {}