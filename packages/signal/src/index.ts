import { computeCleanup, track, trackSet, untrack, type UntrackFunction } from "#lib/track";
import { Signal } from "#structure/Signal";
import { TextProto } from "@amateras/core";
import { _instanceof, _Object_assign, isEqual, forEach, isBoolean, _null } from "@amateras/utils";

declare global {
    export function $<T>(signal: Signal<T>): Signal<T>;

    export namespace $ {
        export function signal<T extends Record<string, any>, P extends ((keyof T) & string)[], C extends SignalConvert<T, P>>(value: T, properties: P, convert: C): SignalStore<T, P[number], C>
        export function signal<T extends Record<string, any>, K extends (keyof T) & string, P extends K[]>(value: T, properties: P): SignalStore<T, P[number]>
        export function signal<T>(value: T): Signal<T>;
        export function effect(callback: (untrack: UntrackFunction) => void): void;
        export function compute<T>(callback: (untrack: UntrackFunction) => T): Signal<T>;
        export function optional<T>(signal: Signal<T | undefined | null> | Signal<T | null> | Signal<T | undefined>): Signal<NonNullable<T>> | null
        export function resolve<T>(value: OrSignal<T>, handle?: (value: T) => void): T;
    }

    export type OrSignal<T = any> = T | SignalTypes<T>
}

export type SignalConvert<T extends Record<string, any>, P extends ((keyof T) & string)[]> = {
    [key in Exclude<keyof T, P[number]>]?: (value: T[key]) => Signal
};
export type SignalTypes<T> = T extends any ? Signal<T> : never;
export type SignalStore<T, K extends keyof T = never, C extends Partial<Record<string, (value: any) => Signal>> = {}> = SignalTypes<T> & {
    [key in K as Exclude<T[K], undefined> extends Function ? never : `${string & key}$`]: SignalTypes<T[key]>
} & {
    [key in keyof C as string extends string ? `${string & key}$` : never]: C[key] extends (value: any) => Signal ? ReturnType<C[key]> : never;
};

_Object_assign($, {
    signal(value: any, properties?: string[], convert?: any) {
        return new Signal(value, properties, convert);
    },

    effect(
        callback: (
            untrack: UntrackFunction
        ) => void
    ) {
        track(callback);
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
                handle(value);
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
        proto.ondom(node => {
            let fn = (value: any) => node.textContent = `${value}`;
            signal.subscribe(fn);
            proto.ondispose(() => signal.unsubscribe(fn));
        })

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
            if (isEqual(name, ['value', 'checked'] as const)) {
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
