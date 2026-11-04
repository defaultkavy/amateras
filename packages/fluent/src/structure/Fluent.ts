import { Utils } from "@amateras/utils";

export class Fluent<Compute = Record<string, any>, Map extends Record<FluentKey, any> = {}> {
    execName = '$'
    execFn: (result: Record<string, any>) => any = (result: Record<string, any>) => result
    initial: any = {};
    result: Record<string, any> = {}
    optionMap = new Map<FluentKey, any>()
    constructor() {}

    init(initial: any) {
        this.initial = initial;
        return this;
    }

    map<const M extends Record<FluentKey, any>>(map: M) {
        Utils.forEach(Utils.entries(map), ([k, v]) => {
            if (Utils.isInstanceof(v, FluentValues)) {
                Utils.forEach(Utils.entries(v.object), ([key, value]) => 
                    this.optionMap.set(key, Utils.isFunction(value) ? (...args: any) => ({[k]: value(...args)}) : {[k]: value}))
            } 
            else if (Utils.isInstanceof(v, FluentGroup)) {
                Utils.forEach(Utils.entries(v.object), ([key, value]) => this.optionMap.set(key, value))
            }
            else if (Utils.isInstanceof(v, FluentOptions, FluentMethod)) {
                this.optionMap.set(k, v.object)
            }
            else this.optionMap.set(k, v)
        })
        return this as Fluent<Compute, Map & M>
    }

    executor<N extends string, C extends any>(name: N, handle: (result: Record<string, any>) => C) {
        this.execName = name;
        this.execFn = handle;
        return this as unknown as Fluent<C, Map>
    }

    proxy() {
        this.reset();
        const proxy = new Proxy({}, {
            get: (_, propName) => {
                const target = this.result;
                if (!Utils.isString(propName)) return;
                if (propName === this.execName) {
                    const result = this.execFn(target);
                    this.reset()
                    return result
                }
                const value = this.optionMap.get(propName);
                if (Utils.isFunction(value)) return (...args: any) => {
                    Utils.assign(target, value(...args))
                    return proxy;
                }
                else Utils.assign(target, value)
                return proxy;
            }
        }) as FluentProxy<Compute, {
            normal: { [key in keyof Map as Map[key] extends FluentObject ? never : key]: Map[key] },
            values: Transform<{ [key in keyof Map & (FluentKey) as Map[key] extends FluentValues ? key : never]: Map[key]['object']}>,
            options: { [key in keyof Map as Map[key] extends FluentOptions ? key : never]: Map[key]['object'] },
            group: Transform<{ [key in keyof Map & (FluentKey) as Map[key] extends FluentGroup ? key : never]: Map[key]['object']}>,
            method: { [key in keyof Map as Map[key] extends FluentMethod ? key : never]: Map[key]['object'] },
        }>
        return proxy
    }

    reset() {
        this.result = structuredClone(this.initial);
    }

    static values<const M extends Record<string, any>>(map: M) {
        return new FluentValues<M>(map)
    }
    
    static group<const M extends Record<string, Record<string, any> | ((...args: any) => Record<string, any>)>>(map: M) {
        return new FluentGroup<M>(map)
    }

    static options<const M extends Record<string, any> | ((...args: any) => Record<string, any>)>(map: M) {
        return new FluentOptions<M>(map)
    }

    static method<const F extends (...args: any) => Record<string, any>>(handle: F) {
        return new FluentMethod<F>(handle)
    }
}

const symbol = Symbol('FluentObject')
class FluentObject {
    [symbol] = symbol
    id: string = '';
    object: any
    constructor(object: any) {
        this.object = object
    }
}

const symbolValues = Symbol('FluentValues')
class FluentValues<O extends Record<string, any> = any> extends FluentObject {
    declare object: O
    [symbolValues] = symbolValues
}

const symbolGroup = Symbol('FluentGroup')
class FluentGroup<O extends Record<string, Record<string, any>> = any> extends FluentObject {
    declare object: O
    [symbolGroup] = symbolGroup
}

const symbolOptions = Symbol('FluentOptions')
class FluentOptions<O extends Record<string, any> = any> extends FluentObject {
    declare object: O
    [symbolOptions] = symbolOptions
}

const symbolMethod = Symbol('FluentMethod')
class FluentMethod<O extends (...args: any) => Record<string, any> = any> extends FluentObject {
    declare object: O
    [symbolMethod] = symbolMethod
}

type FluentKey = string | number;

type FluentMaps = {
    normal: Record<FluentKey, any>
    options: Record<FluentKey, any>
    values: Record<FluentKey, { id: FluentKey, value: any }>
    group: Record<FluentKey, { id: FluentKey, value: any }>
    method: Record<FluentKey, { id: FluentKey, value: any }>
}

type FluentProxy<Compute, Maps extends FluentMaps, Used extends FluentKey = never> = {
    [key in Exclude<keyof Maps['normal'] & FluentKey, Used>]: FluentProcess<Compute, Maps, Maps['normal'][key], Used | key>
} & {
    [key in keyof Maps['values'] & FluentKey as Maps['values'][key]['id'] extends Used ? never: key]: FluentProcess<Compute, Maps, Maps['values'][key]['value'], Used | Maps['values'][key]['id']>
} & {
    [key in keyof Maps['group'] & FluentKey as Maps['group'][key]['id'] extends Used ? never: key]: FluentProcess<Compute, Maps, Maps['group'][key]['value'], Used | Maps['group'][key]['id']>
} & {
    [key in Exclude<keyof Maps['options'] & FluentKey, Used>]: FluentProcess<Compute, Maps, Maps['options'][key], Used | key>
} & {
    [key in keyof Maps['method'] & FluentKey]: FluentProcess<Compute, Maps, Maps['method'][key], Used>
} & {
    $: Compute
}

type FluentProcess<Compute, Maps extends FluentMaps, Value extends any, Used extends FluentKey> = 
    Value extends (...args: infer P) => any
        ?   (...args: P) => 
                FluentProxy<Compute, Maps, Used>
        :   FluentProxy<Compute, Maps, Used>


type Transform<T extends Record<string, Record<string, any>>> = {
  [K in { [P in keyof T]: keyof T[P] }[keyof T]]: {
        [P in keyof T]: K extends keyof T[P]
        ?   {
                id: P;
                value: T[P][K];
            }
        :   never;
  }[keyof T];
};

