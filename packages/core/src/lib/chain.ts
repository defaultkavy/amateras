import { $Node } from "#node/$Node";
import { isUndefined } from "@amateras/utils";

export const chain: chain = <T, R, V>(_this: T, args: IArguments | null, get: (() => R) | null, value: V, set: (value: Exclude<V, undefined>) => any) => {
    if (args && get && !args.length) return get();
    if (isUndefined(value)) return _this;
    for (const setter of $Node.setters) {
        const result = setter(value, set);
        if (!isUndefined(result)) return set(result), _this;
    }
    return set(value as any), _this;
}

interface chain {
    <T, V>(_this: T, args: null, get: null, value: V, set: (value: Exclude<V, undefined | $.$NodeParameterExtends<V>>) => any): T
    <T, R, V>(_this: T, args: IArguments, get: (() => R), value: V, set: (value: Exclude<V, undefined | $.$NodeParameterExtends<V>>) => any): T | R
}