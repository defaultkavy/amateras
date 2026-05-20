import { Null } from "./primitive";

export const isTypeof = (target: any, type: 'string' | 'number' | 'object' | 'boolean' | 'function' | 'bigint' | 'symbol' | 'undefined') => typeof target === type;
export const isIncluded = <T, V>(target: T, args: V[]): target is V & T => args.includes(target as any);
export const isString = (target: any): target is string => isTypeof(target, 'string');
export const isBoolean = (target: any): target is boolean => isTypeof(target, 'boolean');
export const isNumber = (target: any): target is number => isTypeof(target, 'number');
export const isObject = (target: any): target is object => isTypeof(target, 'object');
export const isFunction = (target: any): target is Function => isTypeof(target, 'function');
export const isSymbol = (target: any): target is symbol => isTypeof(target, 'symbol');
export const isAsyncFunction = (target: any): target is AsyncFunction<Awaited<ReturnType<typeof target>>> => isInstanceof(target, (async () => 0).constructor as any)
export const isUndefined = (target: any): target is undefined => target === undefined;
export const isNull = (target: any): target is null => target === Null;
export const isArray = /* @__PURE__ */ Array.isArray;
export const isInstanceof = <T extends (abstract new (...args: any[]) => any)[]>(target: any, ...instance: T): target is InstanceType<T[number]> => !!instance.find(i => target instanceof i);
export const is = <T extends abstract new (...args: any[]) => any>(target: any, instance: T): InstanceType<T> | null => isInstanceof(target, instance) ? target : Null;