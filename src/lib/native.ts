// window and document
export const _document = document;
// Object
export const _Object_fromEntries = Object.fromEntries;
export const _Object_entries = Object.entries;
export const _Object_assign = Object.assign;
export const _Object_values = Object.values;
export const _Object_defineProperty = Object.defineProperty;
export const _Object_getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors;
// Array
export const _Array_from = Array.from;
export const forEach: forEach = <T>(arr: any, fn: any, thisArgs?: any) => arr.forEach(fn, thisArgs);
// type check
export const _typeof = (target: any, type: 'string' | 'number' | 'object' | 'boolean' | 'function' | 'bigint' | 'symbol' | 'undefined') => typeof target === type;
export const equal = <T, V extends T>(target: T, ...args: V[]): target is V => !!args.find(a => a === target);
export const isString = (target: any): target is string => _typeof(target, 'string');
export const isNumber = (target: any): target is number => _typeof(target, 'number')
export const isObject = (target: any): target is object => _typeof(target, 'object')
export const isFunction = (target: any): target is Function => _typeof(target, 'function')
export const isUndefined = (target: any): target is undefined => _typeof(target, 'undefined')
export const isNull = (target: any): target is null => target === null;
export const _instanceof = <T extends (abstract new (...args: any[]) => any)[]>(target: any, ...instance: T): target is InstanceType<T[number]> => !!instance.find(i => target instanceof i);
// JSON
export const _JSON_stringify = JSON.stringify;
export const _JSON_parse = JSON.parse;
// String
export const startsWith = (target: string, ...str: string[]) => !!str.find(s => target.startsWith(s));

interface forEach {
    <T>(arr: Array<T>, fn: (value: T, index: number, array: Array<T>) => any, thisArgs?: any): void;
    <T>(set: Set<T>, fn: (value: T, index: number, set: Set<T>) => any, thisArgs?: any): void;
    <K, V>(set: Map<K, V>, fn: (value: V, key: K, index: number, map: Map<K, V>) => any, thisArgs?: any): void;
    <N extends Node>(set: NodeListOf<N>, fn: (value: N, index: number, parent: NodeListOf<N>) => any, thisArgs?: any): void;
}