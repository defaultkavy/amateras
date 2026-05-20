import { entries } from "./object";
import { Null } from "./primitive";
import { isArray, isNull, isObject } from "./type";

// object member compare
export const isEqual = <T extends Object>(target: T, reference: any, props?: (keyof T)[]) => {
    const propsSet = props ? new Set(props) : Null;
    if (target === reference) return true;
    const targetEntries = entries(target);
    const refEntries = entries(reference);
    if (targetEntries.length !== refEntries.length) return false;
    for (let [ key, value ] of entries(target)) {
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