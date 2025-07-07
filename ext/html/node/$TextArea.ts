import { assignHelper } from "#lib/assignHelper";
import { $HTMLElement } from "#node/$HTMLElement";

export class $TextArea extends $HTMLElement<HTMLTextAreaElement> {
    constructor() {
        super('textarea')
    }
}

export interface $TextArea extends $HTMLElement<HTMLTextAreaElement> {}

assignHelper(HTMLTextAreaElement, $TextArea, 'textarea');

declare module '#core' {
    export function $(nodeName: 'textarea'): $TextArea
}