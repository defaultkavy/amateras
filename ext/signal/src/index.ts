import { Signal } from "#structure/Signal";
import { _document } from "amateras/lib/env";
import { _instanceof, isObject, _JSON_stringify, _Object_assign, forEach, _null, _Object_defineProperty, _Object_entries, isNull, isFunction } from "amateras/lib/native";
import { $Node, $Text } from "amateras/node/$Node";

// handle $Node content process
$Node.processors.add((_, content) => {
    const signal = (content as any).signal;
    if (_instanceof(signal, Signal)) {
        const resolver = signal.value();
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
    const signal = value.signal
    if (isFunction(value) && _instanceof(signal, Signal)) {
        signal.subscribe(set);
        return value();
    }
})

declare module 'amateras/core' {
    export namespace $ {
        export function signal<T>(value: T): SignalFunction<T>;
        export function compute<T>(process: () => T): ComputeFunction<T>; 
        export function effect(process: () => void): void;
        export interface $NodeContentMap<T> {
            signalFn: SignalFunction<T>;
            computeFn: ComputeFunction<T>;
        }
    }
}

type SignalObject<T> = T extends Array<any> ? {} : T extends object ? { [key in keyof T as `${string & key}$`]: SignalFunction<T[key]> } : {};
export type SignalFunction<T> = {
    signal: Signal<T>, 
    set: (newValue: T | ((oldValue: T) => T)) => SignalFunction<T>,
    value: () => T;
} & (() => T) & SignalObject<T>;
export type ComputeFunction<T> = ({(): T}) & { signal: Signal<T> };

const signalComputeListeners = new Set<(signal: Signal<any>) => void>();
const signalEffectListeners = new Set<(signal: Signal<any>) => void>();
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
    compute<T>(process: () => T): ComputeFunction<T> {
        let subscribed = false;
        const signalFn: SignalFunction<any> = $.signal(_null);
        const computeFn = () => {
            if (!subscribed) return signalFn.set(subscribe()).value();
            else return signalFn.set(process()).value();
        }
        const subscribe = () => {
            const signalHandler = (signal: Signal<any>) => 
                signal.subscribe(() => signalFn.set(process())) 
            signalComputeListeners.add(signalHandler);
            const result = process();
            signalComputeListeners.delete(signalHandler);
            subscribed = true;
            return result;
        }
        _Object_assign(computeFn, { signal: signalFn.signal });
        return computeFn as ComputeFunction<T>
    },

    // effect
    effect(process: () => void) {
        const signalHandler = (signal: Signal<any>) => 
            signal.subscribe(process);
        signalEffectListeners.add(signalHandler);
        process();
        signalEffectListeners.delete(signalHandler);
    }
})