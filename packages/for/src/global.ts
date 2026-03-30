import * as proto from "#structure/For";

declare global {
    export var For: typeof proto.For

    export function $<T>(For: typeof proto.For, signal: proto.ForList<T>, layout: proto.ForLayout<T>): proto.For<T>
}