import { I18n } from "#structure/I18n";
import { I18nDictionary, type I18nDictionaryContext, type I18nDictionaryContextImporter } from "#structure/I18nDictionary";
import { I18nTranslation as _I18nTranslation, I18nTranslation, type I18nTranslationOptions } from "#structure/I18nTranslation";
import { _instanceof, _Object_assign } from "@amateras/utils";
import type { GetDictionaryContextByKey, I18nTranslationDirKey, I18nTranslationKey, I18nTranslationParams, Mixin, ResolvedAsyncDictionary } from "./types";

declare global {
    export namespace $ {
        export interface I18nFunction<D extends I18nDictionaryContext = {}> {
            <K extends I18nTranslationKey<D>, P extends I18nTranslationParams<K, D>>(path: K, ...params: P extends Record<string, never> ? [] : [P]): I18nTranslation;
            i18n: I18n;
            locale(lang?: string): Promise<void>;
            add<F extends I18nDictionaryContext | I18nDictionaryContextImporter>(lang: string, dictionary: F): I18nFunction<Mixin<D, (F extends I18nDictionaryContextImporter ? ResolvedAsyncDictionary<F> : F)>>;
            delete(lang: string): this;
            dir<K extends I18nTranslationDirKey<D>>(path: K): I18nFunction<GetDictionaryContextByKey<K, D>>
        }
        export function i18n(defaultLocale: string): I18nFunction;
        export type I18nTranslation = _I18nTranslation;

        export interface TextProcessorValueMap {
            i18n: I18nTranslation
        }
    }
}

_Object_assign($, {
    i18n(defaultLocale: string) {
        const i18n = new I18n(defaultLocale);
        const i18nFn = (key: string, options?: I18nTranslationOptions) => i18n.translate(key, options);
        _Object_assign(i18nFn, { 
            i18n,
            async locale(locale: string) {
                await i18n.setLocale(locale);
            },
            add(lang: string, context: I18nDictionaryContext | I18nDictionaryContextImporter) {
                i18n.map.set(lang, new I18nDictionary(context));
                return this;
            },
            delete(lang: string) {
                i18n.map.delete(lang);
                return this;
            },
            dir(path: string) {
                return (key: string, options?: I18nTranslationOptions) => i18n.translate(`${path}.${key}`, options)
            }
        })
        return i18nFn
    }
})

$.process.text.add(value => {
    if (_instanceof(value, I18nTranslation)) {
        return value
    }
})

export * from "#structure/I18n";
export * from "#structure/I18nDictionary";
export * from "#structure/I18nTranslation";
