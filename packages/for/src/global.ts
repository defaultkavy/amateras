import * as _For from "#structure/For";

declare global {
    export var For: typeof _For.For
    // export function $<T>(For: typeof proto.For, signal: proto.ForList<T>, layout: proto.ForLayout<T>): proto.For<T>

    export namespace $ {
        export interface Overload<I> {
            for: [
                input: [typeof _For.For, _For.ForList<any>],
                output: _For.For,
                args: [layout: I[1] extends _For.ForList<infer T> ? _For.ForLayout<T> : never]
            ]
        }
    }
}