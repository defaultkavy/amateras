import { assignHelper } from "#lib/assignHelper";
import { $HTMLElement } from "#node/$HTMLElement";

export class $Anchor extends $HTMLElement<HTMLAnchorElement> {
    constructor() {
        super('a')
    }
}

export interface $Anchor extends $HTMLElement<HTMLAnchorElement> {
    href(href: string): this;
    href(): string;
}

declare module '#core' {
    export function $(nodeName: 'a'): $Anchor
}

assignHelper(HTMLAnchorElement, $Anchor, 'a');