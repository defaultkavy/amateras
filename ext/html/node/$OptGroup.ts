import { $HTMLElement } from "#node/$HTMLElement";

export class $OptGroup extends $HTMLElement<HTMLOptGroupElement> {
    constructor() {
        super('optgroup')
    }
}

export interface $OptGroup extends $HTMLElement<HTMLOptGroupElement> {}