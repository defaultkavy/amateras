import { Signal } from "#structure/Signal";
import { _document } from "amateras/lib/env";
import { _instanceof, isObject, _JSON_stringify, _Object_assign, forEach, _null, _Object_defineProperty, _Object_entries, isNull, isFunction } from "amateras/lib/native";
import { $Node, $Text } from "amateras/node/$Node";

// handle $Node content process
$Node.processors.add((_, content) => {
    const signal = (content as SignalFunction<any>)?.signal;
    if (_instanceof(signal, Signal)) {
        const resolver = (content as SignalFunction<any>)();
        if (_instanceof(resolver, $Node)) {
            // handler signal $Node result
            let node = resolver;
            const set = (value: any) => {
                node.replace(value);
                node = value;
            }
            signal.subscribe(set);
            return [resolver];
        } else {
            // handler signal other type result
            const $text = new $Text()
            const set = (value: any) => $text.textContent(isObject(value) ? _JSON_stringify(value) : value);
            signal.subscribe(set);
            set(resolver);
            return [$text];
        }
    }
})

// handle $Node native method setter
$Node.setters.add((value, set) => {
    const signal = value?.signal
    if (isFunction(value) && _instanceof(signal, Signal)) {
        signal.subscribe(set);
        return value();
    }
})

declare module 'amateras/core' {
    export namespace $ {
        export function signal<T>(value: T): SignalFunction<T>;
        export function compute<T>(process: (untrack: UntrackHandler) => T): ComputeFunction<T>; 
        export function effect(process: (untrack: UntrackHandler) => void): void;
        export interface $NodeContentMap {
            signalFn: SignalFunction<any>;
            computeFn: ComputeFunction<any>;
        }
        export interface $NodeParameterMap<T> {
            // Distribute T type
            signalFn: T extends any ? SignalFunction<Narrow<T>> : never;
            computeFn: T extends any ? ComputeFunction<Narrow<T>> : never;
        }
    }
}

type SignalObject<T> = T extends Array<any> ? {} : T extends object ? { [key in keyof T as `${string & key}$`]: SignalFunction<T[key]> } : {};
export type SignalFunction<T> = {
    (): T
    signal: Signal<T>, 
    set: (newValue: T | ((oldValue: T) => T)) => SignalFunction<T>,
    value: () => T;
} & SignalObject<T>;
export type ComputeFunction<T> = { 
    (): T
    signal: Signal<T> 
};
export type SignalListener = (signal: Signal<any>) => void;
export type UntrackHandler = <T>(fn: () => T) => T

const signalComputeListeners = new Set<SignalListener>();
const signalEffectListeners = new Set<SignalListener>();
const signalFnMap = new Map<any, SignalFunction<any> | ComputeFunction<any>>();

// experiment feature
const nestedComputeFn = (value: any, parentSignalFn: SignalFunction<any> | ComputeFunction<any>) => {
    if (isObject(value) && !isNull(value)) {
        forEach(_Object_entries(value), ([key, val]) => {
            const cachedFn = signalFnMap.get(val);
            const val$ = cachedFn ?? $.compute(() => parentSignalFn()[key]);
            if (!cachedFn && isObject(val)) {
                signalFnMap.set(val, val$);
                nestedComputeFn(val, val$)
            }
            _Object_defineProperty(parentSignalFn, `${key}$`, {value: val$});
        })
    }
}

_Object_assign($, {
    // signal function
    signal<T>(value: T): SignalFunction<T> {
        const signal = new Signal<T>(value);
        const signalFn = function () { 
            forEach([...signalComputeListeners, ...signalEffectListeners], fn => fn(signal));
            return signal.value();
        } as SignalFunction<T> 
        nestedComputeFn(value, signalFn);
        _Object_assign(signalFn, {
            signal,
            set: (newValue: T) => (signal.value(newValue), signalFn),
            value: () => signal.value()
        })
        return signalFn
    },

    // compute function
    compute<T>(process: (untrack: UntrackHandler) => T): ComputeFunction<T> {
        let subscribed = false;
        const signalFn: SignalFunction<any> = $.signal(_null);
        const computeFn = () => {
            if (!subscribed) return signalFn.set(subscribe()).value();
            else return signalFn.set(process(untrack)).value();
        }
        const untrack = <T>(fn: () => T) => {
            if (subscribed) return fn();
            signalComputeListeners.delete(signalListener);
            const result = fn();
            signalComputeListeners.add(signalListener);
            return result;
        }
        const signalListener = (signal: Signal<any>) => 
            signal.subscribe(() => signalFn.set(process(untrack))) 
        const subscribe = () => {
            signalComputeListeners.add(signalListener);
            const result = process(untrack);
            signalComputeListeners.delete(signalListener);
            subscribed = true;
            return result;
        }
        _Object_assign(computeFn, { signal: signalFn.signal });
        return computeFn as ComputeFunction<T>
    },

    // effect
    effect(process: (untrack: UntrackHandler) => void) {
        let subscribed = false;
        const signalListener = (signal: Signal<any>) => 
            signal.subscribe(_ => process(untrack));
        const untrack = <T>(fn: () => T) => {
            if (subscribed) return fn();
            signalEffectListeners.delete(signalListener);
            const result = fn();
            signalEffectListeners.add(signalListener);
            return result;
        }
        signalEffectListeners.add(signalListener);
        process(untrack);
        signalEffectListeners.delete(signalListener);
        subscribed = true;
    }
})