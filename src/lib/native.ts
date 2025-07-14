// document
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
export function forEach<N extends Node>(set: NodeListOf<N>, fn: (value: N, index: number, parent: NodeListOf<N>) => any, thisArgs?: any): void;
export function forEach<K, V>(set: Map<K, V>, fn: (value: V, key: K, index: number, map: Map<K, V>) => any, thisArgs?: any): void;
export function forEach<T>(set: Set<T>, fn: (value: T, index: number, set: Set<T>) => any, thisArgs?: any): void;
export function forEach<T>(arr: Array<T>, fn: (value: T, index: number, array: Array<T>) => any, thisArgs?: any): void;
export function forEach<T>(arr: any, fn: any, thisArgs?: any) {
    arr.forEach(fn, thisArgs)
}
// typeof
export function _typeof(target: any, type: 'string' | 'number' | 'object' | 'boolean' | 'function' | 'bigint' | 'symbol' | 'undefined') {
    return typeof target === type;
}
export function isString(target: any): target is string {
    return _typeof(target, 'string');
}
export function isNumber(target: any): target is number {
    return _typeof(target, 'number')
}
export function isObject(target: any): target is object {
    return _typeof(target, 'object')
}
export function isFunction(target: any): target is Function {
    return _typeof(target, 'function')
}
export function isUndefined(target: any): target is undefined {
    return _typeof(target, 'undefined')
}
export function isNull(target: any): target is null {
    return target === null;
}
export function _instanceof<T extends (abstract new (...args: any[]) => any)[]>(target: any, ...instance: T): target is InstanceType<T[number]> {
    return !!instance.find(i => target instanceof i);
}
// JSON
export const _JSON_stringify = JSON.stringify;