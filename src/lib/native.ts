// Object
export const _Object_fromEntries = Object.fromEntries;
export const _Object_entries = Object.entries;
export const _Object_assign = Object.assign;
export const _Object_values = Object.values;
export const _Object_defineProperty = Object.defineProperty;
export const _Object_getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors;
// Array
export const _Array_from = Array.from;
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
export function _instanceof<T>(target: any, instance: abstract new (...args: any[]) => T): target is T {
    return target instanceof instance;
}