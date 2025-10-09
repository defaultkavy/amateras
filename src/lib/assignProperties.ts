import type { $EventTarget } from "#node/$EventTarget";
import { $Node } from "#node/$Node";
import { _instanceof, _null, _Object_defineProperty, _Object_entries, _Object_getOwnPropertyDescriptors, forEach, isUndefined } from "./native";

const assigner = (target: any, {set, get, fn}: { 
    set?: string[], 
    get?: string[], 
    fn?: string[]
}) => {
    const [GET, SET, FN] = ['get', 'set', 'fn'] as const;
    const filterAndMap = (type: 'get' | 'set' | 'fn', arr: string[] | undefined) => arr?.map(prop => [type, prop]) ?? []
    const list = [...filterAndMap(GET, get), ...filterAndMap(SET, set), ...filterAndMap(FN, fn)] as [string, string][];
    forEach(list, ([type, prop]) => 
        _Object_defineProperty(target.prototype, prop, {
            ...(type === GET ? {
                get() { return this.node[prop as any] }
            } : {
                writable: true,
                ...(type === SET ? {
                    // set
                    value(this, args: any) {
                        if (!arguments.length) return this.node[prop];
                        let set = (value: any) => !isUndefined(value) && (this.node[prop] = value);
                        for (const setter of $Node.setters) {
                            const result = setter(args, set);
                            if (!isUndefined(result)) return set(result), this;
                        }
                        set(args)
                        return this;
                    }
                } : {
                    // fn
                    value(this, ...args : any[]) {
                        let result = this.node[prop](...args.map(value => _instanceof(value, $Node) ? value.node : value ?? _null))
                        return isUndefined(result) ? this : result;
                    }
                })
            }),

        })
    )
}

export const assignProperties = (object: Constructor<EventTarget>, target: Constructor<$EventTarget>, tagname?: string) => {
    const [set, get, fn] = [[], [], []] as [string[], string[], string[]]
    // assign native object properties to target
    forEach(_Object_entries(_Object_getOwnPropertyDescriptors(object.prototype)), ([prop, value]) => {
        if (!(prop in target.prototype)) {
            if (value.get && !value.set) get.push(prop);
            else if (value.value) fn.push(prop);
            else if (value.get && value.set) set.push(prop);
        }
    })
    assigner(target, {set, get, fn})
    // register tagname
    if (tagname) $.assign([tagname, target])
}