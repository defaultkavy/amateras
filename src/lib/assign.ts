import { Signal } from "../structure/Signal";
import { _instanceof, _Object_defineProperty, isUndefined } from "./native";

export function assign(target: any, {set, get, fn}: { 
    set?: string[], 
    get?: string[], 
    fn?: string[]
}) {
    const [GET, SET, FN] = ['get', 'set', 'fn'] as const;
    const filterAndMap = (type: 'get' | 'set' | 'fn', arr: string[] | undefined) => {
        return arr?.map(prop => [type, prop]) ?? []
    }
    const list = [...filterAndMap(GET, get), ...filterAndMap(SET, set), ...filterAndMap(FN, fn)] as [string, string][];
    for (const [type, prop] of list) {
        _Object_defineProperty(target.prototype, prop, {
            ...(type === GET ? {
                get() { return this.node[prop as any] }
            } : {
                writable: true,
                ...(type === SET ? {
                    // set
                    value: function (this, args: any) {
                        if (!arguments.length) return this.node[prop];
                        const set = (value: any) => !isUndefined(value) && (this.node[prop] = value);
                        if (_instanceof(args, Signal)) args = args.subscribe(set).value();
                        set(args)
                        return this;
                    }
                } : {
                    // fn
                    value: function (this, ...args : any[]) {
                        let result = this.node[prop](...args);
                        return isUndefined(result) ? this : result;
                    }
                })
            }),

        })
    }
}