import { assignHelper } from "#lib/assignHelper";
import { $HTMLElement } from "#node/$HTMLElement";

export class $Input extends $HTMLElement<HTMLInputElement> {
    constructor() {
        super('input')
    }
}

export interface $Input extends $HTMLElement<HTMLInputElement> {}

assignHelper(HTMLInputElement, $Input, 'input');

declare module '#core' {
    export function $(nodeName: 'input'): $Input
}