import { assignHelper } from "#lib/assignHelper";
import { $HTMLElement } from "#node/$HTMLElement";

export class $Image extends $HTMLElement<HTMLImageElement> {
    constructor() {
        super('img')
    }
}

export interface $Image extends $HTMLElement<HTMLImageElement> {
    src(src: string): this;
    src(): string;
}

assignHelper(HTMLImageElement, $Image, 'img');

declare module '#core' {
    export function $(nodeName: 'img'): $Image
}