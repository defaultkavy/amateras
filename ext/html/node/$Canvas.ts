import { assignProperties } from "#lib/assignProperties";
import { $HTMLElement } from "#node/$HTMLElement";

export class $Canvas extends $HTMLElement<HTMLCanvasElement> {
    constructor() {
        super('canvas');
    }
}

export interface $Canvas extends $HTMLElement<HTMLCanvasElement> {
    /** {@link HTMLCanvasElement.height} */
    height(height: $Parameter<number>): this;
    height(): number;
    /** {@link HTMLCanvasElement.width} */
    width(width: $Parameter<number>): this;
    width(): number;

    /** {@link HTMLCanvasElement.captureStream} */
    captureStream(frameRequestRate?: number): MediaStream;
    /** {@link HTMLCanvasElement.getContext} */
    getContext(contextId: "2d", options?: CanvasRenderingContext2DSettings): CanvasRenderingContext2D | null;
    getContext(contextId: "bitmaprenderer", options?: ImageBitmapRenderingContextSettings): ImageBitmapRenderingContext | null;
    getContext(contextId: "webgl", options?: WebGLContextAttributes): WebGLRenderingContext | null;
    getContext(contextId: "webgl2", options?: WebGLContextAttributes): WebGL2RenderingContext | null;
    getContext(contextId: string, options?: any): RenderingContext | null;
    /** {@link HTMLCanvasElement.toBlob} */
    toBlob(callback: BlobCallback, type?: string, quality?: number): this;
    /** {@link HTMLCanvasElement.toDataURL} */
    toDataURL(type?: string, quality?: number): string;
    /** {@link HTMLCanvasElement.transferControlToOffscreen} */
    transferControlToOffscreen(): OffscreenCanvas;
}

assignProperties(HTMLCanvasElement, $Canvas, 'canvas');

declare module '#core' {
    export function $(nodeName: 'canvas'): $Canvas
}