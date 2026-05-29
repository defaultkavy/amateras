import { forEach } from "./forEach";
import { assign } from "./object";

type UnionMerge<T> = {
    [key in (T extends any ? keyof T : never)]: T extends any ? (key extends keyof T ? T[key] : never) : never
}

export const merge = <T extends any[]>(...objects: T): Prettify<UnionMerge<T[number]>> => {
    let merged = {};
    forEach(objects, obj => assign(merged, obj));
    return merged as any;
}