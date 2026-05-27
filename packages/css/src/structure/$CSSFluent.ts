import { Utils } from "@amateras/utils";

declare const map: unique symbol;

export class $CSSFluent<M extends Record<string, CSSFluentGroupMap> = {}> {
    declare [map]: M;
    initRule: $.CSSDeclarationMap;
    optionMap = new Map<string, CSSFluentOption>();
    target = {};
    constructor(initRule?: $.CSSDeclarationMap) {
        this.initRule = initRule ?? {};
    }

    option<N extends string, R extends $.CSSDeclarationMap | ((...args: any) => $.CSSDeclarationMap)>(name: N, resolve: R) {
        if (Utils.isFunction(resolve)) this.optionMap.set(name, {type: 3, name, value: resolve});
        else this.optionMap.set(name, {type: 0, name, value: resolve});
        return this as unknown as $CSSFluent<Prettify<M & Record<N, {[key in N]: R}>>>;
    }

    group<P extends keyof $.CSSDeclarationMap | string & {}, O extends CSSFluentGroupMap<P extends keyof $.CSSDeclarationMap ? Required<$.CSSDeclarationMap>[P] : $.CSSValue>>(prop: P, options: O) {
        Utils.forEach(Utils.entries(options), ([name, value]) => {
            if (value instanceof Function) this.optionMap.set(name, {type: 2, name, value, prop})
            else this.optionMap.set(name, {type: 1, name, value, prop})
        });
        return this as unknown as $CSSFluent<Prettify<M & Record<P, O>>>
    }

    proxy() {
        this.reset();
        const proxy = new Proxy(this.target, {
            get: (_, propName) => {
                const target = this.target;
                if (!Utils.isString(propName)) return;
                if (propName === '$') {
                    const cssMap = {...target};
                    this.reset();
                    return cssMap
                }
                const option = this.optionMap.get(propName);
                if (option) {
                    switch (option.type) {
                        case 0: {
                            Utils.assign(target, option.value);
                            break;
                        }
                        case 1: {
                            Utils.assign(target, { [option.prop]: option.value });
                            break;
                        }
                        case 2: {
                            return (...args: any) => {
                                Utils.assign(target, { [option.prop]: option.value(...args) })
                                return proxy;
                            }
                        }
                        case 3: {
                            return (...args: any) => {
                                Utils.assign(target, option.value(...args))
                                return proxy;
                            }
                        }
                    }
                }
                return proxy;
            }
        }) as CSSFluentProxy<M>
        return proxy
    }

    reset() {
        this.target = {...this.initRule};
    }
}

type CSSFluentOption = {
    name: string;
} & ({
    type: 0;
    value: $.CSSDeclarationMap   
} | ({
    type: 1;
    value: $.CSSValue;
    prop: string
} | {
    type: 2;
    value: Function;
    prop: string
} | {
    type: 3;
    value: Function;
}))

type CSSFluentGroupMap<V extends $.CSSValue = $.CSSValue> = Record<string, V>;

export type CSSFluentProxy<M extends Record<string, CSSFluentGroupMap>, UM = UnionMap<M[keyof M]>> = {
    [key in keyof UM]:
        key extends string ?
            UM[key] extends (...args: any) => any
                ?   (...args: Parameters<UM[key]>) => CSSFluentProxy<Omit<M, GetMapKeyWithKey<key, M>>>
                :   CSSFluentProxy<Omit<M, GetMapKeyWithKey<key, M>>>
        :   never
} & {
    $: $.CSSMap
}

// type FluentKey<M extends CSSFluentGroupMap> = M extends any 
//     ?   {
//         [key in keyof M]: 
//             M[key] extends Function
//                 ? key extends string 
//                     ?   `${key}${number}` | key
//                     :   never
//                 : key
//     }[keyof M]
//     :   never;

type KeyofUnion<T> = T extends any ? keyof T : never;

type UnionMap<T> = {
    [key in (T extends any ? keyof T : never)]: T extends any ? (key extends keyof T ? T[key] : never) : never
}

type GetMapKeyWithKey<T extends string, M extends Record<string, any>> = {
    [key in keyof M]: T extends keyof M[key] ? key : never;
}[keyof M];