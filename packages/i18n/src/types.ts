export type I18nDictionaryContext = {[key: string]: string | I18nDictionaryContext | I18nDictionaryContextImporter}
export type I18nDictionaryContextImporter = () => Promise<{default: I18nDictionaryContext}>

export type I18nTranslationResult = { text: string[], args: any[] }

export type ResolvedAsyncDictionary<F extends I18nDictionaryContextImporter> = Awaited<ReturnType<F>>['default'] extends I18nDictionaryContext ? Awaited<ReturnType<F>>['default'] : never;

export type I18nTranslationKey<T extends I18nDictionaryContext> = {
    [K in keyof T]: K extends string
        ?   T[K] extends string
            ?   `${K}`
            :   T[K] extends I18nDictionaryContextImporter
                ?   `${K}.${I18nTranslationKey<ResolvedAsyncDictionary<T[K]>>}`
                :   T[K] extends I18nDictionaryContext
                    ?   '_' extends keyof T[K]
                        ?   `${K}` | `${K}.${I18nTranslationKey<T[K]>}`
                        :   `${K}.${I18nTranslationKey<T[K]>}`
                    :   never
        :   never;
    }[keyof T]

export type I18nTranslationDirKey<T> = 
    T extends I18nDictionaryContext
    ?   {
            [K in keyof T]: K extends string
            ?   T[K] extends string 
                ?   never
                :   T[K] extends I18nDictionaryContextImporter
                    ?   `${K}` | `${K}.${I18nTranslationDirKey<ResolvedAsyncDictionary<T[K]>>}`
                    :   `${K}` | `${K}.${I18nTranslationDirKey<T[K]>}`
            :   never;
        }[keyof T]
    :   never;

export type I18nTranslationParams<K extends string, T extends I18nDictionaryContext, L extends string[]> = 
    FindTranslationByKey<K, T> extends infer O
    ?   O extends string
        ?   FindParam<O> extends infer P
            ?   P extends Record<string, never> 
                ?   [locale?: L[number]] 
                :   [options: P, locale?: L[number]]
            :   [locale?: L[number]] 
        :   never
    :   never

export type FindParam<T extends string> = 
    T extends `${string}$${infer Param}$${infer Rest}`
    ?   Param extends `${string}${' '}${string}`
        ?   Prettify<{} & FindParam<Rest>>
        :   Prettify<Record<Param, any> & FindParam<Rest>>
    :   {}

export type FindTranslationByKey<K extends string, T extends I18nDictionaryContext> = 
    K extends `${infer Prefix}.${infer Rest}`
    ?   Prefix extends keyof T
        ?   T[Prefix] extends I18nDictionaryContext
            ?   FindTranslationByKey<Rest, T[Prefix]>
            :   T[Prefix] extends I18nDictionaryContextImporter
                ?   FindTranslationByKey<Rest, ResolvedAsyncDictionary<T[Prefix]>>
                :   ''
        :   never
    :   T[K] extends I18nDictionaryContext
        ?   '_' extends keyof T[K]
            ?   T[K]['_']
            :   never
        :   T[K] extends I18nDictionaryContextImporter
            ?   '_' extends keyof ResolvedAsyncDictionary<T[K]>
                ?   ResolvedAsyncDictionary<T[K]>['_']
                :   never
            :   T[K]

export type GetDictionaryContextByKey<K extends string, T extends I18nDictionaryContext> = 
    K extends `${infer Prefix}.${infer Rest}`
    ?   Prefix extends keyof T
        ?   T[Prefix] extends I18nDictionaryContext
            ?   GetDictionaryContextByKey<Rest, T[Prefix]>
            :   T[Prefix] extends I18nDictionaryContextImporter
                ?   GetDictionaryContextByKey<Rest, ResolvedAsyncDictionary<T[Prefix]>>
                :   never
        :   never
    :   T[K] extends I18nDictionaryContextImporter
        ?   ResolvedAsyncDictionary<T[K]>
        :   T[K] extends I18nDictionaryContext
                ?   T[K]
                :   never

export type MixinDictionaryContext<A, B> = (Omit<A, keyof B> & Omit<B, keyof A>)