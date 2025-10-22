import { assignProperties } from "#lib/assignProperties";
import { $HTMLElement } from "#node/$HTMLElement";

export class $Form extends $HTMLElement<HTMLFormElement> {
    constructor() {
        super('form')
    }
}

export interface $Form extends $HTMLElement<HTMLFormElement> {}

assignProperties(HTMLFormElement, $Form, 'form');

declare module '#core' {
    export function $(nodeName: 'form'): $Form
}