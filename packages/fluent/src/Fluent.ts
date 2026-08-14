import { Utils } from "@amateras/utils";

declare const map: unique symbol;
export class Fluent<Compute extends any = any, MapType extends Record<string, any> = Record<string, any>, Result extends Record<string, any> = {}, Executor extends string = '$', Options extends Record<string, FluentValueMap<Result[string]>> = {}> {
    declare [map]: Options;
    optionMap = new Map<string, FluentOption<Result>>();
    result = {};
    initial: any = {};
    executorName = '$';

    init(initial: Result) {
        this.initial = initial;
        return this;
    }

    option<N extends string, T extends MapType | FluentResultFunction<MapType>>(name: N, resolve: T) {
        if (Utils.isFunction(resolve)) this.optionMap.set(name, {type: 3, name, value: resolve});
        else this.optionMap.set(name, {type: 0, name, value: resolve as any});
        return this as unknown as Fluent<Compute, MapType, Result, Executor, Prettify<Options & Record<N, {[key in N]: T}>>>;
    }

    prop<P extends string, O extends FluentValueMap<Result[string]>>(prop: P, options: O) {
        Utils.forEach(Utils.entries(options), ([name, value]) => {
            if (Utils.isFunction(value)) this.optionMap.set(name, {type: 2, name, value, prop})
            else this.optionMap.set(name, {type: 1, name, value, prop})
        });
        return this as unknown as Fluent<Compute, MapType, Prettify<Result & { [ key in P ]: O[keyof O] | undefined }>, Executor, Prettify<Options & Record<P, O>>>
    }

    group<N extends string, O extends FluentResultMap<MapType>>(groupName: N, options: O) {
        Utils.forEach(Utils.entries(options), ([name, value]) => {
            if (Utils.isFunction(value)) this.optionMap.set(name, {type: 3, name, value})
            else this.optionMap.set(name, {type: 0, name, value: value as any })
        })
        return this as unknown as Fluent<Compute, MapType, Result & FluentResultMapResolver<O>, Executor, Prettify<Options & Record<N, O>>>
    }

    executor<N extends string, C extends any>(name: N, handle: (result: Result) => C) {
        this.optionMap.set(name, {type: 4, name, value: handle});
        this.executorName = name;
        return this as unknown as Fluent<C, MapType, Result, N, Options>
    }

    proxy() {
        if (!this.optionMap.get(this.executorName)) {
            this.executor('$', result => result);
        }
        this.reset();
        const proxy = new Proxy({}, {
            get: (_, propName) => {
                const target = this.result;
                if (!Utils.isString(propName)) return;
                const option = this.optionMap.get(propName);
                if (option) {
                    switch (option.type) {
                        case 0: {
                            Object.assign(target, option.value);
                            break;
                        }
                        case 1: {
                            Object.assign(target, { [option.prop]: option.value });
                            break;
                        }
                        case 2: {
                            return (...args: any) => {
                                Object.assign(target, { [option.prop]: option.value(...args) })
                                return proxy;
                            }
                        }
                        case 3: {
                            return (...args: any) => {
                                Object.assign(target, option.value(...args))
                                return proxy;
                            }
                        }
                        case 4: {
                            this.reset();
                            return option.value(target);
                        }
                    }
                }
                return proxy;
            }
        }) as FluentProxy<Compute, Result, Executor, Options>
        return proxy
    }

    reset() {
        this.result = structuredClone(this.initial);
    }
}

type FluentOption<Result extends Record<string, any>> = FluentResultOption<Result> | FluentKeyToValueOption<Result[string]> | FluentKeyToFunctionOption | FluentFunctionOption | FluentExecutorOption;

type FluentBaseOption<T extends number> = { 
    type: T;
    name: string;
};
type FluentResultOption<Result extends any> = FluentBaseOption<0> & { 
    value: Result;
}
type FluentKeyToValueOption<Value extends any> = FluentBaseOption<1> & {
    value: Value;
    prop: string;
}
type FluentKeyToFunctionOption = FluentBaseOption<2> & {
    value: Function;
    prop: string;
}
type FluentFunctionOption = FluentBaseOption<3> & {
    value: Function;
}
type FluentExecutorOption = FluentBaseOption<4> & {
    value: Function;
}

type FluentValueFunction<V extends any> = (...args: any) => V;
type FluentResultFunction<R extends any> = (...args: any[]) => R;
type FluentValueMap<V extends any> = Record<string, V | FluentValueFunction<V>>;
type FluentResultMap<R extends Record<string, any>> = Record<string, R | FluentResultFunction<R>>;

type FluentResultMapResolver<M> =
    M[keyof M] extends infer O
        ?   O extends (...args: any[]) => infer R
            ?   R
            :   O
        :   never

export type FluentProxy<Compute extends any, Result extends Record<string, any>, Executor extends string, Options extends Record<string, FluentValueMap<Result[string]>>, UM = UnionMap<Options[keyof Options]>> = {
    [key in keyof UM]:
        key extends string ?
            UM[key] extends (...args: any) => any
                ?   (...args: Parameters<UM[key]>) => FluentProxy<Compute, Result, Executor, Omit<Options, GetMapKeyWithKey<key, Options>>>
                :   FluentProxy<Compute, Result, Executor, Omit<Options, GetMapKeyWithKey<key, Options>>>
        :   never
} & {
    [key in Executor]: Compute;
}

type UnionMap<T> = {
    [key in (T extends any ? keyof T : never)]: T extends any ? (key extends keyof T ? T[key] : never) : never
}

type GetMapKeyWithKey<T extends string, M extends Record<string, any>> = {
    [key in keyof M]: T extends keyof M[key] ? key : never;
}[keyof M];