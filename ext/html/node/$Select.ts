import { $HTMLElement } from "#node/$HTMLElement";

export class $Select extends $HTMLElement<HTMLSelectElement> {
    constructor() {
        super('select')
    }
}

export interface $Select extends $HTMLElement<HTMLSelectElement> {}