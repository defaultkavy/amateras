import { $HTMLElement } from "#node/$HTMLElement";

export class $Canvas extends $HTMLElement<HTMLCanvasElement> {
    constructor() {
        super('canvas')
    }
}

export interface $Canvas extends $HTMLElement<HTMLCanvasElement> {}