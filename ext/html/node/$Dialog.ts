import { $HTMLElement } from "#node/$HTMLElement";

export class $Dialog extends $HTMLElement<HTMLDialogElement> {
    constructor() {
        super('dialog')
    }
}

export interface $Dialog extends $HTMLElement<HTMLDialogElement> {}