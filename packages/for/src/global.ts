import * as _For from "#structure/For";
import type { SignalObject } from "@amateras/signal";

declare global {
    export var For: typeof _For.For
    // export function $<T>(For: typeof proto.For, signal: proto.ForList<T>, layout: proto.ForLayout<T>): proto.For<T>

    export namespace $ {
        export interface Overload<I> {
            for: [
                input: [typeof _For.For, _For.ForIterable],
                output: _For.For,
                args: [
                    layout: _For.ForLayout<
                        I[1] extends SignalObject<infer T>
                        ?   T extends Array<infer K> | Set<infer K>
                            ?   [K]
                            :   T extends Map<infer K, infer V>
                                ?   [K, V]
                                :   never
                        :   never
                    > ]
            ]
        }
    }
}