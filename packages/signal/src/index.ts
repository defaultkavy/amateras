import { computeCleanup, track, trackSet, untrack, type UntrackFunction } from "#lib/track";
import { Signal } from "#structure/Signal";
import { GlobalState, Proto, ProxyProto, TextProto } from "@amateras/core";
import { Utils } from '@amateras/utils';

declare global {
    export namespace $ {
        export function signal<T>(value: T): SignalTypes<T>;
        export function effect(callback: (untrack: UntrackFunction) => void, signals?: Signal[]): void;
        export function compute<T>(callback: (untrack: UntrackFunction) => T, signals?: Signal[]): SignalTypes<T>;
        export function optional<T>(signal: Signal<T | undefined | null> | Signal<T | null> | Signal<T | undefined>): Signal<NonNullable<T>> | null
        export function resolve<T>(value: T, handle?: (value: T extends Signal<infer K> | SignalObject<infer K> ? K : T) => void): T;

        export interface Overload<I> {
            signal: [
                input: [Signal],
                output: TextProto,
                args: []
            ]
        }
    }

    export type OrSignal<T = any> = T | SignalTypes<T>
}

declare module '@amateras/core' {
    export interface GlobalState {
        signals: Set<Signal>;
    }
}

export type SignalTypes<T> = 
    [ResolveNestedSignal<T>] extends [infer Resolved] 
    ?   [Resolved] extends [object]
        ?   SignalObject<Resolved> 
            :   Signal<Resolved>
    :   never;

type ResolveNestedSignal<T> = T extends Signal<infer R> | SignalObject<infer R> ? ResolveNestedSignal<R> : T;

export type SignalObject<T> = Signal<T> & {
    [key in keyof T as Exclude<T[key], undefined> extends Signal ? `${string & key}` : Exclude<T[key], undefined> extends Function ? never : `${string & key}$`]: T[key] extends Signal ? T[key] : SignalTypes<T[key]>
}

GlobalState.assign(() => ({
    signals: new Set()
}))

GlobalState.disposers.add(global => {
    Utils.forEach(global.signals, signal => signal.dispose());
    global.signals.clear();
})

Utils.assign($, {
    signal: (value: any) => new Signal(value),

    effect(
        callback: (
            untrack: UntrackFunction
        ) => void,
        signals: Signal[] = []
    ) {
        track(callback);
        Utils.forEach(signals, signal => trackSet.add(signal));
        Utils.forEach(trackSet, signal => signal.subscribe(_ => callback(untrack)));
        trackSet.clear();
    },
    
    compute<T>(
        callback: (
            untrack: UntrackFunction
        ) => T,
        signals: Signal[] = []
    ) {
        let result = track(callback);
        let compute = $.signal(result);
        let proto = Proto.proto;
        compute.exec = () => {
            $.context(Proto, proto, () => {
                compute.set(callback(untrack));
            })
        }
        Utils.forEach(signals, signal => trackSet.add(signal));
        Utils.forEach(trackSet, signal => {
            signal.computes = signal.computes ?? new Set();
            let ref = new WeakRef(compute);
            signal.computes.add(ref);
            computeCleanup.register(compute, {signal, ref})
        });
        trackSet.clear();
        return compute
    },

    optional<T>(signal: Signal<T | undefined | null>): Signal<Exclude<T, null | undefined>> | null {
        if (signal.value) return signal as any;
        else return Utils.Null
    },

    resolve: (value: OrSignal, handle?: (value: any) => void) => {
        if (Utils.isInstanceof(value, Signal<any>)) {
            if (handle) {
                value.subscribe(handle);
                handle(value.value);
            }
            return value.value
        }
        handle?.(value);
        return value
    }
})

let toProxyProto = (signal: Signal) => {
    if (Utils.isInstanceof(signal, Signal)) {
        let proxy = new ProxyProto();
        let $text: undefined | TextProto = Utils.Undefined;
        let fn = (value: any) => {
            // improve text content update performance
            if (Utils.isString(value) || Utils.isBoolean(value) || Utils.isNumber(value)) {
                if ($text) $text.content = `${value}`;
                else proxy.layout = () => $text = $([ value ]).at(0) as TextProto;
                if (!proxy.builded) proxy.build();
            } else {
                $text = Utils.Undefined;
                proxy.layout = () => $([ value ]);
                Utils.forEach(proxy.protos, proto => proto.removeNode())
                // clean children nodes and dispose
                proxy.clear(true);
                if (proxy.builded) proxy.build();
                proxy.node?.replaceWith(...proxy.toDOM());
            }
        }
        signal.subscribe(fn);
        proxy.listen('dispose', () => signal.unsubscribe(fn));
        fn(signal.value);
        return proxy;
    }
}

$.process.text.add(toProxyProto)
$.process.craft.add(toProxyProto)
$.process.attr.add((name, signal, proto) => {
    if (Utils.isInstanceof(signal, Signal)) {
        let setNodeAttr = () => proto.attr(name, signal.value as any);
        signal.subscribe(setNodeAttr);
        setNodeAttr();
        proto.listen('dispose', () => signal.unsubscribe(setNodeAttr))
        return true;
    }
})

export * from "#structure/Signal";
