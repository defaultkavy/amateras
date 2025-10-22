import { assignProperties } from "#lib/assignProperties";
import { $HTMLElement } from "#node/$HTMLElement";

export class $Dialog extends $HTMLElement<HTMLDialogElement> {
    constructor() {
        super('dialog')
    }
}

export interface $Dialog extends $HTMLElement<HTMLDialogElement> {}

assignProperties(HTMLDialogElement, $Dialog, 'dialog');

declare module '#core' {
    export function $(nodeName: 'dialog'): $Dialog
}