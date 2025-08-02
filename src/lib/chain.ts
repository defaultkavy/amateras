import { isUndefined } from "./native";

export const chain: chain = <T, R, V>(_this: T, args: IArguments | null, get: (() => R) | null, value: V, set: (value: Exclude<V, undefined>) => any) => 
    args && get && !args.length 
    ? get()
    : isUndefined(value) 
        ? _this 
        : (set(value as any), _this);

interface chain {
    <T, V>(_this: T, args: null, get: null, value: V, set: (value: Exclude<V, undefined>) => any): T
    <T, R, V>(_this: T, args: IArguments, get: (() => R), value: V, set: (value: Exclude<V, undefined>) => any): T | R
}