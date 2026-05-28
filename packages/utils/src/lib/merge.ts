import { forEach } from "./forEach";
import { assign } from "./object";

export const merge = (objects: Object[]) => {
    let merged = {};
    forEach(objects, obj => assign(merged, obj));
    return merged;
}