import type { $Node } from "#node/$Node";
import { assign } from "./assign";
import { _Object_entries, _Object_getOwnPropertyDescriptors } from "./native";

export function assignHelper(targets: [object: Constructor<Node>, target: Constructor<$Node>, tagname?: string][]) {
    for (const [object, target, tagname] of targets) {
        const {set, get, fn} = { set: [] as string[], get: [] as string[], fn: [] as string[] }
        // assign native object properties to target
        for (const [prop, value] of _Object_entries(_Object_getOwnPropertyDescriptors(object.prototype))) {
            if (prop in target.prototype) continue;
            if (value.get && !value.set) get.push(prop);
            else if (value.value) fn.push(prop);
            else if (value.get && value.set) set.push(prop);
        }
        assign(target, {set, get, fn})
        // register tagname
        if (tagname) $.registerTagName(tagname, target)
    }
}