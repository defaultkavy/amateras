import { assignProperties } from "#lib/assignProperties";
import { $HTMLElement } from "#node/$HTMLElement";

export class $TextArea extends $HTMLElement<HTMLTextAreaElement> {
    constructor() {
        super('textarea')
    }
}

export interface $TextArea extends $HTMLElement<HTMLTextAreaElement> {}

assignProperties(HTMLTextAreaElement, $TextArea, 'textarea');

declare module '#core' {
    export function $(nodeName: 'textarea'): $TextArea
}