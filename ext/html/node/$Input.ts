import { $HTMLElement } from "#node/$HTMLElement";

export class $Input extends $HTMLElement<HTMLInputElement> {
    constructor() {
        super('input')
    }
}

export interface $Input extends $HTMLElement<HTMLInputElement> {}