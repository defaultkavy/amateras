import { assignHelper } from "#lib/assignHelper";
import { $HTMLElement } from "#node/$HTMLElement";

export class $Form extends $HTMLElement<HTMLFormElement> {
    constructor() {
        super('form')
    }
}

export interface $Form extends $HTMLElement<HTMLFormElement> {}

assignHelper(HTMLFormElement, $Form, 'form');

declare module '#core' {
    export function $(nodeName: 'form'): $Form
}