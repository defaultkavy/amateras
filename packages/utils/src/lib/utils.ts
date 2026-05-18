import '../global';

// Value
export const _null = null;
export const _undefined = undefined;
// Object
const _Object = Object;
export const _Object_fromEntries = _Object.fromEntries;
export const _Object_entries = _Object.entries;
export const _Object_assign = _Object.assign;
export const _Object_values = _Object.values;
export const _Object_defineProperty = _Object.defineProperty;
export const _Object_getOwnPropertyDescriptors = _Object.getOwnPropertyDescriptors;
// Array
const _Array = Array;
export const _Array_from = _Array.from;
interface forEach {
    <T>(arr: Array<T> | null | undefined, fn: (value: T, index: number, array: Array<T>) => Promise<void>): Promise<void>;
    <T>(arr: Array<T> | null | undefined, fn: (value: T, index: number, array: Array<T>) => void): void;
    <T>(set: Set<T> | null | undefined, fn: (value: T, index: number, set: Set<T>) => Promise<void>): void;
    <T>(set: Set<T> | null | undefined, fn: (value: T, index: number, set: Set<T>) => void): void;
    <T extends WeakKey>(set: WeakSet<T> | null | undefined, fn: (value: T, index: number, set: WeakSet<T>) => Promise<void>): void;
    <T extends WeakKey>(set: WeakSet<T> | null | undefined, fn: (value: T, index: number, set: WeakSet<T>) => void): void;
    <T>(list: Array<T> |  Set<T> | null | undefined, fn: (value: T, index: number, set: Array<T> | Set<T>) => Promise<void>): void;
    <T>(list: Array<T> | Set<T> | null | undefined, fn: (value: T, index: number, set: Array<T> | Set<T>) => void): void;
    <K, V>(map: Map<K, V> | null | undefined, fn: (value: [K, V], index: number, map: Map<K, V>) => Promise<void>): void;
    <K, V>(map: Map<K, V> | null | undefined, fn: (value: [K, V], index: number, map: Map<K, V>) => void): void;
    <N extends Node>(set: NodeListOf<N> | null | undefined, fn: (value: N, index: number, parent: NodeListOf<N>) => Promise<void>): void;
    <N extends Node>(set: NodeListOf<N> | null | undefined, fn: (value: N, index: number, parent: NodeListOf<N>) => void): void;
    <K>(iterator: MapIterator<K>, fn: (value: K, index: number, arr: Array<K>) => Promise<void>): void;
    <K>(iterator: MapIterator<K>, fn: (value: K, index: number, arr: Array<K>) => void): void;
}
export const forEach: forEach = async (arr: any, fn: any) => {
    if (!arr) return;
    let i = 0;
    let asyncHandle = async () => { for (let item of arr) { await fn(item, i, arr); i++; } };
    let handle = () => { for (let item of arr) { fn(item, i, arr); i++; } };
    return isAsyncFunction(fn) ? asyncHandle() : handle();
};
interface map {
    <T, R>(arr: Array<T>, fn: (value: T, index: number, array: Array<T>) => R): R[];
    <T, R>(set: Set<T>, fn: (value: T, index: number, set: Set<T>) => R): R[];
    <T extends WeakKey>(set: WeakSet<T>, fn: (value: T, index: number, set: WeakSet<T>) => Promise<void>): T[];
    <T extends WeakKey>(set: WeakSet<T>, fn: (value: T, index: number, set: WeakSet<T>) => void): T[];
    <T, R>(list: Array<T> | Set<T>, fn: (value: T, index: number, set: Array<T> | Set<T>) => R): R[];
    <K, V, R>(map: Map<K, V>, fn: (value: [K, V], index: number, map: Map<K, V>) => R): R[];
    <N extends Node, R>(set: NodeListOf<N>, fn: (value: N, index: number, parent: NodeListOf<N>) => R): R[];
}
export const map: map = (arr: any, fn: any) => _Array_from(arr).map(fn);

export const filterValue = <T, V>(arr: Array<T>, ...values: V[]): Array<Exclude<T, V>> => arr.filter(item => !values.includes(item as any)) as any;

// type check
export const _typeof = (target: any, type: 'string' | 'number' | 'object' | 'boolean' | 'function' | 'bigint' | 'symbol' | 'undefined') => typeof target === type;
export const isIncluded = <T, V>(target: T, args: V[]): target is V & T => args.includes(target as any);
export const isString = (target: any): target is string => _typeof(target, 'string');
export const isBoolean = (target: any): target is boolean => _typeof(target, 'boolean');
export const isNumber = (target: any): target is number => _typeof(target, 'number');
export const isObject = (target: any): target is object => _typeof(target, 'object');
export const isFunction = (target: any): target is Function => _typeof(target, 'function');
export const isSymbol = (target: any): target is symbol => _typeof(target, 'symbol');
export const isAsyncFunction = (target: any): target is AsyncFunction<Awaited<ReturnType<typeof target>>> => _instanceof(target, (async () => 0).constructor as any)
export const isUndefined = (target: any): target is undefined => target === undefined;
export const isNull = (target: any): target is null => target === _null;
export const isArray = _Array.isArray;
export const _instanceof = <T extends (abstract new (...args: any[]) => any)[]>(target: any, ...instance: T): target is InstanceType<T[number]> => !!instance.find(i => target instanceof i);
export const is = <T extends abstract new (...args: any[]) => any>(target: any, instance: T): InstanceType<T> | null => _instanceof(target, instance) ? target : _null;
// JSON
export const _JSON_stringify = JSON.stringify;
export const _JSON_parse = JSON.parse;
// String
export const startsWith = (target: string, ...str: string[]) => !!str.find(s => target.startsWith(s));
// String & Array
interface slice {
    (target: string, start?: number, end?: number): string;
    <T>(target: Array<T>, start?: number, end?: number): T[];
}
export const slice: slice = (target: any, start?: number, end?: number) => target.slice(start, end);
// Function
export const _bind = <T extends Function>(target: T, obj: Object): T => target.bind(obj);
// Promise
export const _Promise = Promise;

// utils function
export const debounce = (fn: Function, timeout: number) => {
    let timer: ReturnType<typeof setTimeout> | null = _null;
    let rerun = false;
    return () => {
        if (timer) {
            rerun = true;
            return
        }
        timer = setTimeout(() => {
            timer = _null;
            if (rerun) fn();
            rerun = false;
        }, timeout);
        return fn();
    } 
}

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = LOWER.toUpperCase();
export interface RandomIdOptions {
    length?: number;
    lettercase?: 'any' | 'lower' | 'upper';
}
export const randomId = (options?: RandomIdOptions): string => { 
    options = {length: 5, lettercase: 'any', ...options};
    const char = options.lettercase === 'any' ? LOWER + UPPER : options.lettercase === 'lower' ? LOWER : UPPER;
    return _Array_from({length: options.length as number}, (_, i) => char[Math.round(Math.random() * char.length)]).join(''); 
}

export const sleep = async (ms: number) => new _Promise(resolve => setTimeout(resolve, ms));

export const toArray = <T>(item: OrArray<T>): T[] => _instanceof(item, Array) ? item : [item];

export interface trycatch {
    <D>(callback: () => D): D extends Promise<infer T> ? Promise<Result<T, Error>> : Result<D, Error>
}

//@ts-ignore
export const trycatch: trycatch = (callback: any) => {
    try {
        const result = callback();
        if (_instanceof(result, Promise)) return result.then(res => [res, _null]);
        return [result, _null];
    } catch (err) {
        return [_null, _instanceof(err, Error) ? err : new Error(_JSON_stringify(err))];
    }
}

export const uppercase = (str: string, start?: number, end?: number) => `${slice(str, 0, start)}${slice(str, start, end).toUpperCase()}${end ? slice(str, end) : ''}`
const _URL = URL;
export const toURL = (path: string | URL, base = globalThis.origin ?? 'http://localhost') => {
    if (_instanceof(path, _URL)) return path;
    return new URL(path, base)
}

// object member compare
export const isEqual = <T extends Object>(target: T, reference: any, props?: (keyof T)[]) => {
    const propsSet = props ? new Set(props) : _null;
    if (target === reference) return true;
    const targetEntries = _Object_entries(target);
    const refEntries = _Object_entries(reference);
    if (targetEntries.length !== refEntries.length) return false;
    for (let [ key, value ] of _Object_entries(target)) {
        if (propsSet && !propsSet.has(key as any)) continue;
        const targetValue = reference[key as keyof T];
        if (targetValue !== value) {
            if (isNull(targetValue) || isNull(value)) return false;
            if (Number.isNaN(targetValue) && Number.isNaN(value)) continue;
            if (isObject(targetValue) && isObject(value)) {
                if (isArray(value) && isArray(targetValue)) {
                    if (value.length !== targetValue.length) return false;
                    
                }
                if (isEqual(value, targetValue)) continue;
                else return false
            }
            return false;
        }
    }
    return true
}