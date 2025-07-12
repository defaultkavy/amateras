import { assignHelper } from "#lib/assignHelper";
import { $HTMLElement } from "#node/$HTMLElement";

export class $OptGroup extends $HTMLElement<HTMLOptGroupElement> {
    constructor() {
        super('optgroup')
    }
}

export interface $OptGroup extends $HTMLElement<HTMLOptGroupElement> {
    /** {@link HTMLOptGroupElement.disabled} */
    disabled(disabled: $Parameter<boolean>): this;
    disabled(): boolean;
    /** {@link HTMLOptGroupElement.label} */
    label(label: $Parameter<string>): this;
    label(): string;
}

assignHelper(HTMLOptGroupElement, $OptGroup, 'optgroup');

declare module '#core' {
    export function $(nodeName: 'optgroup'): $OptGroup
}