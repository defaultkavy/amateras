// Value
export const _null = null;
export const _undefined = undefined;
// Object
export const _Object_fromEntries = Object.fromEntries;
export const _Object_entries = Object.entries;
export const _Object_assign = Object.assign;
export const _Object_values = Object.values;
export const _Object_defineProperty = Object.defineProperty;
export const _Object_getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors;
// Array
export const _Array_from = Array.from;
interface forEach {
    <T>(arr: Array<T>, fn: (value: T, index: number, array: Array<T>) => Promise<void>): Promise<void>;
    <T>(arr: Array<T>, fn: (value: T, index: number, array: Array<T>) => void): void;
    <T>(set: Set<T>, fn: (value: T, index: number, set: Set<T>) => Promise<void>): void;
    <T>(set: Set<T>, fn: (value: T, index: number, set: Set<T>) => void): void;
    <K, V>(map: Map<K, V>, fn: (value: V, key: K, index: number, map: Map<K, V>) => Promise<void>): void;
    <K, V>(map: Map<K, V>, fn: (value: V, key: K, index: number, map: Map<K, V>) => void): void;
    <N extends Node>(set: NodeListOf<N>, fn: (value: N, index: number, parent: NodeListOf<N>) => Promise<void>): void;
    <N extends Node>(set: NodeListOf<N>, fn: (value: N, index: number, parent: NodeListOf<N>) => void): void;
}
export const forEach: forEach = async (arr: any, fn: any) => {
    let i = 0;
    let isAsync = isAsyncFunction(fn);
    let handle = async () => { for (let item of arr) { isAsync ? await fn(item, i, arr) : fn(item, i, arr); i++; } }
    return isAsync ? new _Promise<void>(resolve => handle().then(resolve)) : handle();
};
// export const forEach: forEach = (arr: any, fn: any) => arr.forEach(fn);
// type check
export const _typeof = (target: any, type: 'string' | 'number' | 'object' | 'boolean' | 'function' | 'bigint' | 'symbol' | 'undefined') => typeof target === type;
export const equal = <T, V extends T>(target: T, ...args: V[]): target is V => !!args.find(a => a === target);
export const isString = (target: any): target is string => _typeof(target, 'string');
export const isBoolean = (target: any): target is boolean => _typeof(target, 'boolean');
export const isNumber = (target: any): target is number => _typeof(target, 'number');
export const isObject = (target: any): target is object => _typeof(target, 'object');
export const isFunction = (target: any): target is Function => _typeof(target, 'function');
export const isAsyncFunction = (target: any): target is AsyncFunction<Awaited<ReturnType<typeof target>>> => _instanceof(target, (async () => 0).constructor as any)
export const isUndefined = (target: any): target is undefined => target === undefined;
export const isNull = (target: any): target is null => target === _null;
export const isArray = Array.isArray;
export const _instanceof = <T extends (abstract new (...args: any[]) => any)[]>(target: any, ...instance: T): target is InstanceType<T[number]> => !!instance.find(i => target instanceof i);
// JSON
export const _JSON_stringify = JSON.stringify;
export const _JSON_parse = JSON.parse;
// String
export const startsWith = (target: string, ...str: string[]) => !!str.find(s => target.startsWith(s));
// Function
export const _bind = (target: Function, obj: Object) => target.bind(obj);
// Promise
export const _Promise = Promise;