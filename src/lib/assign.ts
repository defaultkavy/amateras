import { Signal } from "../structure/Signal";
import { _instanceof, _Object_defineProperty, forEach, isUndefined } from "./native";

export const assign = (target: any, {set, get, fn}: { 
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
                        if (_instanceof(args, Signal)) args = args.subscribe(set).value();
                        set(args)
                        return this;
                    }
                } : {
                    // fn
                    value(this, ...args : any[]) {
                        let result = this.node[prop](...args)
                        return isUndefined(result) ? this : result;
                    }
                })
            }),

        })
    )
}