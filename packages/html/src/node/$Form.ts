import { assignProperties } from "@amateras/core/lib/assignProperties";
import { $HTMLElement } from "@amateras/core/node/$HTMLElement";

export class $Form extends $HTMLElement<HTMLFormElement> {
    constructor() {
        super('form')
    }
}

export interface $Form extends $HTMLElement<HTMLFormElement> {}

assignProperties(HTMLFormElement, $Form, 'form');

declare module "@amateras/core" {
    export function $(nodeName: 'form'): $Form
}