import { $HTMLElement } from "#node/$HTMLElement";

export class $Form extends $HTMLElement<HTMLFormElement> {
    constructor() {
        super('form')
    }
}

export interface $Form extends $HTMLElement<HTMLFormElement> {}