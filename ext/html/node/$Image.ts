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