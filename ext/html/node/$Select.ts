import { assignHelper } from "#lib/assignHelper";
import { $HTMLElement } from "#node/$HTMLElement";

export class $Select extends $HTMLElement<HTMLSelectElement> {
    constructor() {
        super('select')
    }
}

export interface $Select extends $HTMLElement<HTMLSelectElement> {}

assignHelper(HTMLSelectElement, $Select, 'select');

declare module '#core' {
    export function $(nodeName: 'select'): $Select
}