import { assignProperties } from "@amateras/core/lib/assignProperties";
import { $HTMLElement } from "@amateras/core/node/$HTMLElement";

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

assignProperties(HTMLOptGroupElement, $OptGroup, 'optgroup');

declare module "@amateras/core" {
    export function $(nodeName: 'optgroup'): $OptGroup
}