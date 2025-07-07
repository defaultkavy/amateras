import { assignHelper } from "#lib/assignHelper";
import { $HTMLElement } from "#node/$HTMLElement";

export class $OptGroup extends $HTMLElement<HTMLOptGroupElement> {
    constructor() {
        super('optgroup')
    }
}

export interface $OptGroup extends $HTMLElement<HTMLOptGroupElement> {}

assignHelper(HTMLOptGroupElement, $OptGroup, 'optgroup');

declare module '#core' {
    export function $(nodeName: 'optgroup'): $OptGroup
}