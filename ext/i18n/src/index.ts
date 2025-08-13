import { _Array_from, _instanceof, _Object_assign } from "amateras/lib/native"
import { $ } from "amateras/core"
import { I18n } from "#structure/I18n"
import type { I18nText as _I18nText, I18nTextOptions } from "#node/I18nText";
import { I18nDictionary, type I18nDictionaryContext, type I18nDictionaryContextImporter } from "#structure/I18nDictionary";

_Object_assign($, {
    i18n(defaultLocale: string) {
        const i18n = new I18n(defaultLocale);
        const i18nFn = (key: string, options?: I18nTextOptions) => i18n.translate(key, options);
        _Object_assign(i18nFn, { 
            i18n,
            locale(locale: string) {
                if (!arguments.length) return i18n.locale();
                i18n.locale(locale);
                return this;
            },
            add(lang: string, context: I18nDictionaryContext | I18nDictionaryContextImporter) {
                i18n.map.set(lang, new I18nDictionary(context));
                return this;
            },
            delete(lang: string) {
                i18n.map.delete(lang);
                return this;
            }
        })
        return i18nFn
    }
})

type ResolvedAsyncDictionary<F extends I18nDictionaryContextImporter> = Awaited<ReturnType<F>>['default'];

type I18nTranslationKey<T> = 
    T extends I18nDictionaryContext
    ?   {
            [K in keyof T]: K extends string
            ?   K extends '_' 
                ?   never 
                :   T[K] extends string
                    ?   `${K}`
                    :   '_' extends keyof T[K]
                        ?   `${K}` | `${K}.${I18nTranslationKey<T[K]>}`
                        :   `${K}.${I18nTranslationKey<T[K]>}`
            :   never;
        }[keyof T]
    :   never;

type I18nTranslationParams<K extends string, T extends I18nDictionaryContext> = 
    FindTranslationByKey<K, T> extends infer O
    ?   O extends string
        ?   FindParam<O>
        :   never
    :   never

type FindParam<T extends string> = 
    T extends `${string}$${infer Param}$${infer Rest}`
    ?   Param extends `${string}${' '}${string}`
        ?   Prettify<{} & FindParam<Rest>>
        :   Prettify<Record<Param, any> & FindParam<Rest>>
    :   {}

type FindTranslationByKey<K extends string, T extends I18nDictionaryContext> = 
    K extends `${infer Prefix}.${infer Rest}`
    ?   Prefix extends keyof T
        ?   T[Prefix] extends I18nDictionaryContext
            ?   FindTranslationByKey<Rest, T[Prefix]>
            :   T[Prefix]
        :   ''
    :   T[K] extends object
        ?   '_' extends keyof T[K]
            ?   T[K]['_']
            :   never
        :   T[K]

type Mixin<A, B> = 
    (Omit<A, keyof B> & Omit<B, keyof A>) & {
        [key in (keyof A & keyof B)]: 
            A[key] extends object
            ?   B[key] extends object
                ?   Mixin<A[key], B[key]>
                :   A[key] | B[key]
            :   A[key] | B[key]  
    }

declare module "amateras/core" {
    export namespace $ {
        export interface I18nFunction<D extends I18nDictionaryContext = {}> {
            <K extends I18nTranslationKey<D>, P extends I18nTranslationParams<K, D>>(path: K, ...params: P extends Record<string, never> ? [] : [P]): I18nText;
            i18n: I18n;
            locale(): string;
            locale(lang?: $Parameter<string>): this;
            add<F extends I18nDictionaryContext | I18nDictionaryContextImporter>(lang: string, dictionary: F): I18nFunction<Mixin<D, (F extends I18nDictionaryContextImporter ? ResolvedAsyncDictionary<F> : F)>>;
            delete(lang: string): this;
        }
        export function i18n(defaultLocale: string): I18nFunction;
        export type I18nText = _I18nText;
    }
}