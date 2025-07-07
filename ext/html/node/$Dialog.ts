import { assignHelper } from "#lib/assignHelper";
import { $HTMLElement } from "#node/$HTMLElement";

export class $Dialog extends $HTMLElement<HTMLDialogElement> {
    constructor() {
        super('dialog')
    }
}

export interface $Dialog extends $HTMLElement<HTMLDialogElement> {}

assignHelper(HTMLDialogElement, $Dialog, 'dialog');

declare module '#core' {
    export function $(nodeName: 'dialog'): $Dialog
}