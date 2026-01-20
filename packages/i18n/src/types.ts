import type { I18nDictionaryContext, I18nDictionaryContextImporter } from "#structure/I18nDictionary";

export type ResolvedAsyncDictionary<F extends I18nDictionaryContextImporter> = Awaited<ReturnType<F>>['default'];

export type I18nTranslationKey<T> = 
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

export type I18nTranslationDirKey<T> = 
    T extends I18nDictionaryContext
    ?   {
            [K in keyof T]: K extends string
            ?   T[K] extends string 
                ?   never
                :   `${K}` | `${K}.${I18nTranslationDirKey<T[K]>}`
            :   never;
        }[keyof T]
    :   never;

export type I18nTranslationParams<K extends string, T extends I18nDictionaryContext> = 
    FindTranslationByKey<K, T> extends infer O
    ?   O extends string
        ?   FindParam<O>
        :   never
    :   never

export type FindParam<T extends string> = 
    T extends `${string}$${infer Param}$${infer Rest}`
    ?   Param extends `${string}${' '}${string}`
        ?   Prettify<{} & FindParam<Rest>>
        :   Prettify<Record<Param, $.Layout> & FindParam<Rest>>
    :   {}

export type FindTranslationByKey<K extends string, T extends I18nDictionaryContext> = 
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

export type GetDictionaryContextByKey<K extends string, T extends I18nDictionaryContext> =
    K extends `${infer Prefix}.${infer Rest}`
    ?   Prefix extends keyof T
        ?   T[Prefix] extends I18nDictionaryContext
            ?   GetDictionaryContextByKey<Rest, T[Prefix]>
            :   never
        :   never
    :   T[K] extends object
        ?   T[K]
        :   never

export type Mixin<A, B> = 
    (Omit<A, keyof B> & Omit<B, keyof A>) & {
        [key in (keyof A & keyof B)]: 
            A[key] extends object
            ?   B[key] extends object
                ?   Mixin<A[key], B[key]>
                :   A[key] | B[key]
            :   A[key] | B[key]  
    }
