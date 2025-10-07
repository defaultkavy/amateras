import { assignProperties } from "#lib/assignProperties";
import { $HTMLElement } from "#node/$HTMLElement";

export class $Canvas extends $HTMLElement<HTMLCanvasElement> {
    constructor() {
        super('canvas')
    }
}

export interface $Canvas extends $HTMLElement<HTMLCanvasElement> {}

assignProperties(HTMLCanvasElement, $Canvas, 'canvas');

declare module '#core' {
    export function $(nodeName: 'canvas'): $Canvas
}