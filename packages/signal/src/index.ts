import { Signal } from "#structure/Signal";
import { $Node, $Text, type $NodeContentResolver } from "@amateras/core/node/$Node";
import { _instanceof, isObject, _JSON_stringify, _Object_assign, forEach, _null, _Object_defineProperty, _Object_entries, isNull, isFunction, _Promise, toArray } from "@amateras/utils";

// handle $Node content process
$Node.processors.add((_, content) => {
    const signal = (content as SignalFunction<any>)?.signal;
    if (_instanceof(signal, Signal)) {
        const signalValue = (content as SignalFunction<any>)();
        const signalHandler = (resolver: any): $NodeContentResolver<any> => {
            if (_instanceof(resolver, _Promise)) {
                return resolver.then(signalHandler) as any;
            }
            else if (_instanceof(resolver, $Node)) {
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
        return signalHandler(signalValue);
    }
})

// handle $Node native method setter
$Node.setters.add((value, set) => {
    const signal = value?.signal;
    if (isFunction(value) && _instanceof(signal, Signal)) {
        signal.subscribe(set);
        return value();
    }
})

declare module '@amateras/core' {
    export namespace $ {
        export function signal<T>(value: T): SignalFunction<T>;
        export function compute<T>(process: (untrack: UntrackHandler) => T): ComputeFunction<T>; 
        export function effect(process: (untrack: UntrackHandler) => void): void;
        export function await<K, O extends SignalAwaitOptions<K, unknown>>(signalFn: SignalFunction<OrPromise<K>> | ComputeFunction<OrPromise<K>>, options: O): O[keyof O];
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
type SignalValue<T> = T extends Promise<infer R> ? T | R : T;
export type SignalPromiseState = 'await' | 'then' | 'catch';
export type SignalAwaitOptions<T, R> = {
    await: R | (() => R);
    then: R | ((value: T) => R);
    catch: R | ((error: any) => R);
}

export type SignalFunction<T> = {
    (): T;
    signal: Signal<T>;
    set: (newValue: SignalValue<T> | ((oldValue: T) => SignalValue<T>)) => SignalFunction<T>;
    value: () => T;
    state: SignalPromiseState;
    await: <R>(resolver: R) => AwaitFunction<T, R>
} & SignalObject<T>;

export type ComputeFunction<T> = { 
    (): T;
    signal: Signal<T>;
    state: SignalPromiseState;
};

export type AwaitFunction<T, R> = {
    (): R;
    then<D>(resolver: (value: Awaited<T>) => D): AwaitFunction<T, R | D>;
    then<D>(resolver: D): AwaitFunction<T, R | D>;
    catch<D>(resolver: (error: any) => D): AwaitFunction<T, R | D>;
    catch<D>(resolver: D): AwaitFunction<T, R | D>;
} & ComputeFunction<T>

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

const AWAIT = 'await';
const THEN = 'then';
const CATCH = 'catch';

_Object_assign($, {
    // signal function
    signal<T>(value: T): SignalFunction<T> {
        const signal = new Signal<T>(value);
        const signalFn = function () { 
            forEach([...signalComputeListeners, ...signalEffectListeners], fn => fn(signal));
            return signal.value();
        } as SignalFunction<T> 
        nestedComputeFn(value, signalFn);
        if (_instanceof(value, _Promise)) {
            value.catch(err => {
                signalFn.state = CATCH; 
                signal.value(err);
            }).then(v => {
                signalFn.state = THEN;
                signal.value(v as any);
            })
        }
        _Object_assign(signalFn, {
            signal,
            set: (newValue: T) => (signal.value(newValue), signalFn),
            value: () => signal.value(),
            state: _instanceof(value, _Promise) ? AWAIT : THEN,

            await(awaitResolver: any) {
                let thenResolver: any = _null
                let catchResolver: any = _null
                const awaitFn = $.compute(untrack => {
                    const value = signalFn();
                    return untrack(() => {
                        switch (signalFn.state) {
                            case AWAIT: return isFunction(awaitResolver) ? awaitResolver() : awaitResolver;
                            case THEN: return isFunction(thenResolver) ? thenResolver(value as any) : thenResolver;
                            case CATCH: return isFunction(catchResolver) ? catchResolver(value) : catchResolver;
                        }
                    })
                })

                _Object_assign(awaitFn, {
                    then(resolver: any) {
                        thenResolver = resolver;
                        return awaitFn;
                    },
                    catch(resolver: any) {
                        catchResolver = resolver;
                        return awaitFn;
                    }
                })

                return awaitFn;
            }
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
    },
})