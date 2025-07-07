import { assignHelper } from "#lib/assignHelper";
import { $HTMLElement } from "#node/$HTMLElement";

export class $Canvas extends $HTMLElement<HTMLCanvasElement> {
    constructor() {
        super('canvas')
    }
}

export interface $Canvas extends $HTMLElement<HTMLCanvasElement> {}

assignHelper(HTMLCanvasElement, $Canvas, 'canvas');

declare module '#core' {
    export function $(nodeName: 'canvas'): $Canvas
}