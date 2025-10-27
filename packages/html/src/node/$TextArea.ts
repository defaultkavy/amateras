import { assignProperties } from "@amateras/core/lib/assignProperties";
import { $HTMLElement } from "@amateras/core/node/$HTMLElement";

export class $TextArea extends $HTMLElement<HTMLTextAreaElement> {
    constructor() {
        super('textarea')
    }
}

export interface $TextArea extends $HTMLElement<HTMLTextAreaElement> {}

assignProperties(HTMLTextAreaElement, $TextArea, 'textarea');

declare module "@amateras/core" {
    export function $(nodeName: 'textarea'): $TextArea
}