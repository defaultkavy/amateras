import { I18nDictionary, type I18nDictionaryContext, type I18nDictionaryContextImporter } from "#structure/I18nDictionary";
import { I18nTranslation } from "./I18nTranslation";
import { I18nSession } from "./I18nSession";
import { onclient, Proto } from "@amateras/core";
import type { I18nTranslationKey, I18nTranslationParams, Mixin, ResolvedAsyncDictionary, I18nTranslationDirKey, GetDictionaryContextByKey } from "../types";
import { Utils } from '@amateras/utils';

export class I18n<D extends I18nDictionaryContext = {}, L extends string[] = []> {
    #locale: string;
    dictionaries = new Map<string, I18nDictionary>();
    defaultLocale: string;
    sessions = new Set<I18nSession>();
    path = '';
    static key = '__locale__';
    constructor(defaultLocale: string) {
        this.defaultLocale = defaultLocale;
        this.#locale = defaultLocale;
    }

    add(lang: string, dictionary: I18nDictionaryContext | I18nDictionaryContextImporter) {
        this.dictionaries.set(lang, new I18nDictionary(dictionary));
        return this as any;
    }

    delete(lang: string) {
        this.dictionaries.delete(lang);
        return this;
    }

    t<K extends I18nTranslationKey<D>, P extends I18nTranslationParams<K, D>>(path: K, ...params: P extends Record<string, never> ? [locale?: L[number]] : [options: P, locale?: L[number]]): I18nTranslation;
    t(key: string, ...args: any[]) {
        return new I18nTranslation(this.session, this.getFullPath(key), ...args);
    }

    text<K extends I18nTranslationKey<D>, P extends I18nTranslationParams<K, D>>(path: K, ...params: P extends Record<string, never> ? [locale?: L[number]] : [options: P, locale?: L[number]]): Promise<string>;
    async text(key: string, ...args: any[]) {
        let content = await this.session.fetch(this.getFullPath(key), ...args)
        return content.text.reduce((acc, str, i) => acc + str + (content.args[i] || ''), '')
    }

    dir(path: string) {
        let i18n = this;
        return {
            t: (key: string, options: any, locale: string) => i18n.t(`${path}.${key}` as any, options, locale),
            text: (key: string, options: any) => i18n.text(`${path}.${key}` as any, options),
            dir: (postPath: string) => i18n.dir(`${path}.${postPath}`)
        } as unknown as I18nDir;
    }

    locale(): L[number];
    locale(locale: L[number]): Promise<void>;
    locale(locale?: L[number]) {
        if (!arguments.length) {
            this.readStoreLocale();
            return this.#locale;
        }
        if (!locale) return;
        let dictionary = this.dictionaries.get(locale);
        if (!dictionary) {
            let splited = locale.split('-');
            if (splited.length === 1) return;
            return this.locale(splited[0]!);
        }
        this.#locale = locale;
        this.writeStoreLocale(locale);
        return Promise.all(Utils.map(this.sessions, session => session.locale(locale)));
    }

    private getFullPath(key: string) {
        return this.path ? `${this.path}.${key}` : key;
    }

    get session() {
        let parentProto = Proto.proto;
        if (parentProto) {
            let session = parentProto.global.i18n.session ?? new I18nSession(this, parentProto.global);
            parentProto.global.i18n.session = session;
            return session;
        }
        else throw 'I18n.getSession(): session not found from Proto.proto'
    }

    private readStoreLocale() {
        if (onclient()) this.#locale = localStorage.getItem(I18n.key) ?? this.defaultLocale;
    }
    
    private writeStoreLocale(locale: string) {
        if (onclient()) localStorage.setItem(I18n.key, locale);
    }
}

export interface I18n<D extends I18nDictionaryContext = {}, L extends string[] = []> {
    add<F extends I18nDictionaryContext | I18nDictionaryContextImporter, T extends string>(lang: T, dictionary: F): I18n<Mixin<D, (F extends I18nDictionaryContextImporter ? ResolvedAsyncDictionary<F> : F)>, [...L, T]>;
    delete(lang: string): this;
    t<K extends I18nTranslationKey<D>, P extends I18nTranslationParams<K, D>>(path: K, ...params: P extends Record<string, never> ? [locale?: L[number]] : [options: P, locale?: L[number]]): I18nTranslation;
    text<K extends I18nTranslationKey<D>, P extends I18nTranslationParams<K, D>>(path: K, ...params: P extends Record<string, never> ? [locale?: L[number]] : [options: P, locale?: L[number]]): Promise<string>;
    dir<K extends I18nTranslationDirKey<D>>(path: K): I18nDir<GetDictionaryContextByKey<K, D>, L>
}

export interface I18nDir<D extends I18nDictionaryContext = {}, L extends string[] = []> {
    t<K extends I18nTranslationKey<D>, P extends I18nTranslationParams<K, D>>(path: K, ...params: P extends Record<string, never> ? [locale?: L[number]] : [options: P, locale?: L[number]]): I18nTranslation;
    text<K extends I18nTranslationKey<D>, P extends I18nTranslationParams<K, D>>(path: K, ...params: P extends Record<string, never> ? [locale?: L[number]] : [options: P, locale?: L[number]]): Promise<string>;
    dir<K extends I18nTranslationDirKey<D>>(path: K): I18n<GetDictionaryContextByKey<K, D>>
}