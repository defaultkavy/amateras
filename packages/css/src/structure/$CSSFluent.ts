import { Utils } from "@amateras/utils";

declare const map: unique symbol;

export class $CSSFluent<M extends Record<string, CSSFluentGroupMap> = {}> {
    declare [map]: M;
    initRule: $.CSSDeclarationMap;
    optionMap = new Map<string, $.CSSDeclarationMap>();
    target = {};
    constructor(initRule?: $.CSSDeclarationMap) {
        this.initRule = initRule ?? {};
    }

    option<N extends string>(name: N, rule: $.CSSDeclarationMap) {
        this.optionMap.set(name, rule);
        return this as $CSSFluent<Prettify<M & Record<N, {[key in N]: $.CSSDeclarationMap}>>>;
    }

    group<P extends keyof $.CSSDeclarationMap | string & {}, O extends CSSFluentGroupMap<P extends keyof $.CSSDeclarationMap ? Required<$.CSSDeclarationMap>[P] : $.CSSValue>>(prop: P, options: O) {
        Utils.forEach(Utils.entries(options), ([name, value]) => this.optionMap.set(name, {[prop]: value}));
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
                if (option) Utils.assign(target, option)
                return proxy;
            }
        }) as CSSFluentProxy<M>
        return proxy
    }

    reset() {
        this.target = {...this.initRule};
    }
}

type CSSFluentGroupMap<V extends $.CSSValue = $.CSSValue> = Record<string, V>;

// export class CSSFluentGroup<P extends string = any, M extends CSSFluentGroupMap = {}> {
//     declare [map]: M;
//     propertyName: P;
//     options: CSSFluentGroupMap = {};
//     constructor(propertyName: P) {
//         this.propertyName = propertyName;
//     }
//     option<N extends string, V extends P extends keyof $.CSSDeclarationMap ? Required<$.CSSDeclarationMap>[P] : $.CSSValue>(name: N, value: V) {
//         this.options[name] = value;
//         return this as unknown as CSSFluentGroup<P, Prettify<M & Record<N, V>>>;
//     }
// }

export type CSSFluentProxy<M extends Record<string, CSSFluentGroupMap>> = {
    [key in KeyofUnion<M[KeyofUnion<M>]>]: CSSFluentProxy<Omit<M, GetMapKeyWithKey<key, M>>>
} & {
    $: $.CSSMap
}

type KeyofUnion<T> = T extends any ? keyof T : never;

type GetMapKeyWithKey<T extends string, M extends Record<string, any>> = {
    [key in keyof M]: T extends keyof M[key] ? key : never;
}[keyof M];