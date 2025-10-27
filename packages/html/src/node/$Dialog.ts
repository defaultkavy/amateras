import { assignProperties } from "@amateras/core/lib/assignProperties";
import { $HTMLElement } from "@amateras/core/node/$HTMLElement";

export class $Dialog extends $HTMLElement<HTMLDialogElement> {
    constructor() {
        super('dialog')
    }
}

export interface $Dialog extends $HTMLElement<HTMLDialogElement> {}

assignProperties(HTMLDialogElement, $Dialog, 'dialog');

declare module "@amateras/core" {
    export function $(nodeName: 'dialog'): $Dialog
}