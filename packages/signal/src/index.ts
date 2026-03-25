import { track, trackSet, untrack, type UntrackFunction } from "#lib/track";
import { Signal } from "#structure/Signal";
import { TextProto } from "@amateras/core";
import { _instanceof, _Object_assign, isEqual, forEach, isBoolean, _null } from "@amateras/utils";

declare global {
    export function $<T>(signal: Signal<T>): Signal<T>;

    export namespace $ {
        export function signal<T extends Record<string, any>, K extends keyof T>(value: T, properties: K[]): SignalStore<T, K>
        export function signal<T>(value: T): Signal<T>;
        export function effect(callback: (untrack: UntrackFunction) => void): void;
        export function compute<T>(callback: (untrack: UntrackFunction) => T): Signal<T>;
        export function optional<T>(signal: Signal<T | undefined | null> | Signal<T | null> | Signal<T | undefined>): Signal<NonNullable<T>> | null
    }
}

export type SignalStore<T, K extends keyof T = never> = Signal<T> & {[key in K as Exclude<T[K], undefined> extends Function ? never : `${string & key}$`]: Signal<T[key]>}

_Object_assign($, {
    signal(value: any, properties?: string[]) {
        return new Signal(value, properties);
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
        let compute = new Signal(result);
        forEach(trackSet, signal => signal.subscribe(_ => compute.set(callback(untrack))));
        trackSet.clear();
        return compute
    },

    optional<T>(signal: Signal<T | undefined | null>): Signal<Exclude<T, null | undefined>> | null {
        if (signal.value) return signal as any;
        else return _null
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
