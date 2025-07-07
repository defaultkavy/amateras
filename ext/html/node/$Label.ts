import { assignHelper } from "#lib/assignHelper";
import { $HTMLElement } from "#node/$HTMLElement";

export class $Label extends $HTMLElement<HTMLLabelElement> {
    constructor() {
        super('label')
    }
}

export interface $Label extends $HTMLElement<HTMLLabelElement> {}

assignHelper(HTMLLabelElement, $Label, 'label');

declare module '#core' {
    export function $(nodeName: 'label'): $Label
}