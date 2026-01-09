import * as proto from "#structure/For";
import type { Signal } from "@amateras/signal/structure/Signal";

declare global {
    export var For: typeof proto.For

    export function $<T extends object>(For: typeof proto.For, signal: proto.ForList<T>, builder: proto.ForBuilder<T>): proto.For
}