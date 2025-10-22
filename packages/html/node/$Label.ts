import { assignProperties } from "#lib/assignProperties";
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

assignProperties(HTMLLabelElement, $Label, 'label');

declare module '#core' {
    export function $(nodeName: 'label'): $Label
}