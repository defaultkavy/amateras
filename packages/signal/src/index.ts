import { computeCleanup, track, trackSet, untrack, type UntrackFunction } from "#lib/track";
import { Signal } from "#structure/Signal";
import { GlobalState, TextProto } from "@amateras/core";
import { _instanceof, _Object_assign, isIncluded, forEach, isBoolean, _null } from "@amateras/utils";

declare global {
    export namespace $ {
        export function signal<T>(value: T): SignalTypes<T>;
        export function effect(callback: (untrack: UntrackFunction) => void, signals?: Signal[]): void;
        export function compute<T>(callback: (untrack: UntrackFunction) => T): SignalTypes<T>;
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
    forEach(global.signals, signal => signal.dispose());
    global.signals.clear();
})

_Object_assign($, {
    signal: (value: any) => new Signal(value),

    effect(
        callback: (
            untrack: UntrackFunction
        ) => void,
        signals: Signal[] = []
    ) {
        track(callback);
        forEach(signals, signal => trackSet.add(signal));
        forEach(trackSet, signal => signal.subscribe(_ => callback(untrack)));
        trackSet.clear();
    },
    
    compute<T>(
        callback: (
            untrack: UntrackFunction
        ) => T
    ) {
        let result = track(callback);
        let compute = $.signal(result);
        compute.exec = () => compute.set(callback(untrack));
        forEach(trackSet, signal => {
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
        else return _null
    },

    resolve: (value: OrSignal, handle?: (value: any) => void) => {
        if (_instanceof(value, Signal<any>)) {
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

let toTextProto = (signal: Signal) => {
    if (_instanceof(signal, Signal)) {
        let proto = new TextProto(`${signal}`);
        let fn = (value: any) => proto.content = `${value}`;
        signal.subscribe(fn);
        proto.ondispose(() => signal.unsubscribe(fn));
        fn(signal.value);
        return proto;
    }
}

$.process.text.add(toTextProto)
$.process.craft.add(toTextProto)
$.process.attr.add((name, signal, proto) => {
    if (_instanceof(signal, Signal)) {
        if (proto.tagname === 'input') {
            if (isIncluded(name, ['value', 'checked'] as const)) {
                proto.on('input', e => signal.set((e.currentTarget as HTMLInputElement)[name]));
                let value = signal.value;
                if (isBoolean(value)) value && proto.attr(name, '');
                else proto.attr(name, `${value}`)
            }
        } 
        else {
            let setNodeAttr = () => proto.attr(name, signal.value as any);
            signal.subscribe(setNodeAttr);
            setNodeAttr();
            proto.ondispose(() => signal.unsubscribe(setNodeAttr))
        }
        
        return true;
    }
})

export * from "#structure/Signal";
