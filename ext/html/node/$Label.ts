import { assignHelper } from "#lib/assignHelper";
import { $HTMLElement } from "#node/$HTMLElement";

export class $Label extends $HTMLElement<HTMLLabelElement> {
    constructor() {
        super('label')
    }
}

export interface $Label extends $HTMLElement<HTMLLabelElement> {
    /** {@link HTMLLabelElement.control} */
    readonly control: HTMLElement | null;
    /** {@link HTMLLabelElement.form} */
    readonly form: HTMLFormElement | null;
    
    /** {@link HTMLLabelElement.htmlFor} */
    htmlFor(htmlFor: $Parameter<string>): this;
    htmlFor(): string;
}

assignHelper(HTMLLabelElement, $Label, 'label');

declare module '#core' {
    export function $(nodeName: 'label'): $Label
}