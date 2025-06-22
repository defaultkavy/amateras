import { Signal } from "../structure/Signal";

export function assign(target: any, {set, get, fn}: { 
    set?: string[], 
    get?: string[], 
    fn?: string[]
}) {
    const filterAndMap = (type: 'get' | 'set' | 'fn', arr: string[] | undefined) => {
        return arr?.map(prop => [type, prop]) ?? []
    }
    const list = [...filterAndMap('get', get), ...filterAndMap('set', set), ...filterAndMap('fn', fn)] as [string, string][];
    for (const [type, prop] of list) {
        Object.defineProperty(target.prototype, prop, {
            ...(type === 'get' ? {
                get() { return this.node[prop as any] }
            } : {
                writable: true,
                ...(type === 'set' ? {
                    // set
                    value: function (this, args: any) {
                        if (!arguments.length) return this.node[prop];
                        const set = (value: any) => value !== undefined && (this.node[prop] = value);
                        if (args instanceof Signal) args = args.subscribe(set).value();
                        set(args)
                        return this;
                    }
                } : {
                    // fn
                    value: function (this, ...args : any[]) {
                        return this.node[prop](...args) ?? this;
                    }
                })
            }),

        })
    }
}