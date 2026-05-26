import { Utils } from "@amateras/utils";

declare const map: unique symbol;

export class $CSSFluent<M extends Record<string, CSSFluentGroupMap> = {}> {
    declare [map]: M;
    initRule: $.CSSDeclarationMap;
    groupMap = new Map<string, CSSFluentGroup>();
    optionMap = new Map<string, $.CSSDeclarationMap>();
    target = {};
    constructor(initRule?: $.CSSDeclarationMap) {
        this.initRule = initRule ?? {};
    }

    option<N extends string>(name: N, rule: $.CSSDeclarationMap) {
        this.optionMap.set(name, rule);
        return this as $CSSFluent<Prettify<M & Record<N, {[key in N]: $.CSSDeclarationMap}>>>;
    }

    group<P extends keyof $.CSSDeclarationMap | string & {}, H extends (group: CSSFluentGroup<P>) => CSSFluentGroup>(propertyName: P, handle: H) {
        const group = handle(new CSSFluentGroup(propertyName));
        Utils.forEach(Utils.entries(group.options), ([name]) => this.groupMap.set(name, group));
        return this as $CSSFluent<Prettify<M & Record<P, ReturnType<H>[typeof map]>>>
    }

    proxy() {
        this.reset();
        const proxy = new Proxy(this.target, {
            get: (target, propName) => {
                if (!Utils.isString(propName)) return;
                if (propName === '$') {
                    const cssMap = {...target};
                    this.reset();
                    return cssMap
                }
                const group = this.groupMap.get(propName);
                const option = this.optionMap.get(propName);
                if (option) {
                    Utils.assign(target, option)
                }
                if (group) {
                    const value = group.options[propName];
                    Utils.assign(target, { [group.propertyName]: value })
                }
                return proxy;
            },
            getOwnPropertyDescriptor(target, p) {
                return Reflect.getOwnPropertyDescriptor(target, p);
            },
            ownKeys(target) {
                return Reflect.ownKeys(target).map(prop => `_${prop as string}`)
            },
        }) as CSSFluentProxy<M>
        return proxy
    }

    reset() {
        this.target = {...this.initRule};
    }
}

type CSSFluentGroupMap = Record<string, $.CSSValue>;

export class CSSFluentGroup<P extends string = any, M extends CSSFluentGroupMap = {}> {
    declare [map]: M;
    propertyName: P;
    options: CSSFluentGroupMap = {};
    constructor(propertyName: P) {
        this.propertyName = propertyName;
    }
    option<N extends string, V extends P extends keyof $.CSSDeclarationMap ? Required<$.CSSDeclarationMap>[P] : $.CSSValue>(name: N, value: V) {
        this.options[name] = value;
        return this as unknown as CSSFluentGroup<P, Prettify<M & Record<N, V>>>;
    }
}

export type CSSFluentProxy<M extends Record<string, CSSFluentGroupMap>> = {
    [key in KeyofUnion<M[KeyofUnion<M>]>]: CSSFluentProxy<Omit<M, GetMapKeyWithKey<key, M>>>
} & {
    $: $.CSSMap
}

type KeyofUnion<T> = T extends any ? keyof T : never;

type GetMapKeyWithKey<T extends string, M extends Record<string, any>> = {
    [key in keyof M]: T extends keyof M[key] ? key : never;
}[keyof M];