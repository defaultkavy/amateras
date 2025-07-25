import type { $Node } from "#node/$Node";
import { assign } from "./assign";
import { _Object_entries, _Object_getOwnPropertyDescriptors } from "./native";

export function assignHelper(object: Constructor<Node>, target: Constructor<$Node>, tagname?: string) {
    const [set, get, fn] = [[], [], []] as [string[], string[], string[]]
    // assign native object properties to target
    for (const [prop, value] of _Object_entries(_Object_getOwnPropertyDescriptors(object.prototype))) {
        if (prop in target.prototype) continue;
        if (value.get && !value.set) get.push(prop);
        else if (value.value) fn.push(prop);
        else if (value.get && value.set) set.push(prop);
    }
    assign(target, {set, get, fn})
    // register tagname
    if (tagname) $.assign(tagname, target)
}