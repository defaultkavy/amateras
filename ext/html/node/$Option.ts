import { assignHelper } from "#lib/assignHelper";
import { $HTMLElement } from "#node/$HTMLElement";

export class $Option extends $HTMLElement<HTMLOptionElement> {
    constructor() {
        super('option')
    }
}

export interface $Option extends $HTMLElement<HTMLOptionElement> {}

assignHelper(HTMLOptionElement, $Option, 'option');

declare module '#core' {
    export function $(nodeName: 'option'): $Option
}