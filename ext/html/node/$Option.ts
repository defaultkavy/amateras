import { $HTMLElement } from "#node/$HTMLElement";

export class $Option extends $HTMLElement<HTMLOptionElement> {
    constructor() {
        super('option')
    }
}

export interface $Option extends $HTMLElement<HTMLOptionElement> {}