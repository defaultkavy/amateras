import { assignProperties } from "@amateras/core/lib/assignProperties";
import { $HTMLElement } from "@amateras/core/node/$HTMLElement";

export class $Image extends $HTMLElement<HTMLImageElement> {
    constructor() {
        super('img')
    }
}

export interface $Image extends $HTMLElement<HTMLImageElement> {
    /** {@link HTMLImageElement.complete} */
    readonly complete: boolean;
    /** {@link HTMLImageElement.currentSrc} */
    readonly currentSrc: string;
    /** {@link HTMLImageElement.naturalHeight} */
    readonly naturalHeight: number;
    /** {@link HTMLImageElement.naturalWidth} */
    readonly naturalWidth: number;
    /** {@link HTMLImageElement.x} */
    readonly x: number;
    /** {@link HTMLImageElement.y} */
    readonly y: number;

    /** {@link HTMLImageElement.decode} */
    decode(): Promise<this>;

    /** {@link HTMLImageElement.alt} */
    alt(alt: $Parameter<string>): this;
    alt(): string;
    /** {@link HTMLImageElement.crossOrigin} */
    crossOrigin(crossOrigin: $Parameter<string | null>): this;
    crossOrigin(): string | null;
    /** {@link HTMLImageElement.decoding} */
    decoding(decoding: $Parameter<"async" | "sync" | "auto">): this;
    decoding(): "async" | "sync" | "auto";
    /** {@link HTMLImageElement.fetchPriority} */
    fetchPriority(fetchPriority: $Parameter<"high" | "low" | "auto">): this;
    fetchPriority(): "high" | "low" | "auto";
    /** {@link HTMLImageElement.height} */
    height(height: $Parameter<number>): this;
    height(): number;
    /** {@link HTMLImageElement.isMap} */
    isMap(isMap: $Parameter<boolean>): this;
    isMap(): boolean;
    /** {@link HTMLImageElement.loading} */
    loading(loading: $Parameter<"eager" | "lazy">): this;
    loading(): "eager" | "lazy";
    /** {@link HTMLImageElement.referrerPolicy} */
    referrerPolicy(referrerPolicy: $Parameter<string>): this;
    referrerPolicy(): string;
    /** {@link HTMLImageElement.sizes} */
    sizes(sizes: $Parameter<string>): this;
    sizes(): string;
    /** {@link HTMLImageElement.src} */
    src(src: $Parameter<string>): this;
    src(): string;
    /** {@link HTMLImageElement.srcset} */
    srcset(srcset: $Parameter<string>): this;
    srcset(): string;
    /** {@link HTMLImageElement.useMap} */
    useMap(useMap: $Parameter<string>): this;
    useMap(): string;
    /** {@link HTMLImageElement.width} */
    width(width: $Parameter<number>): this;
    width(): number;
}

assignProperties(HTMLImageElement, $Image, 'img');

declare module "@amateras/core" {
    export function $(nodeName: 'img'): $Image
}