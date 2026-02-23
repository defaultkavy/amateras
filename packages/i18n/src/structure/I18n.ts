import { I18nDictionary, type I18nDictionaryContext, type I18nDictionaryContextImporter } from "#structure/I18nDictionary";
import { I18nTranslation, type I18nTranslationOptions } from "./I18nTranslation";
import { I18nSession } from "./I18nSession";
import { onclient, Proto } from "@amateras/core";
import type { I18nTranslationKey, I18nTranslationParams, Mixin, ResolvedAsyncDictionary, I18nTranslationDirKey, GetDictionaryContextByKey } from "../types";
import { map } from "@amateras/utils";

export class I18n<D extends I18nDictionaryContext = {}> {
    #locale: string;
    dictionaries = new Map<string, I18nDictionary>();
    defaultLocale: string;
    sessions = new Set<I18nSession>();
    session = new I18nSession(this);
    path = '';
    static key = '__locale__';
    constructor(defaultLocale: string) {
        this.defaultLocale = defaultLocale;
        this.#locale = defaultLocale;
        this.sessions.add(this.session);
    }

    add(lang: string, dictionary: I18nDictionaryContext | I18nDictionaryContextImporter) {
        this.dictionaries.set(lang, new I18nDictionary(dictionary));
        return this as any;
    }

    delete(lang: string) {
        this.dictionaries.delete(lang);
        return this;
    }

    t(key: string, options?: I18nTranslationOptions) {
        return new I18nTranslation(this.getSession(), this.getFullPath(key), options);
    }

    async text(key: string, options?: I18nTranslationOptions) {
        let content = await this.getSession().fetch(this.getFullPath(key), options)
        return content.text.reduce((acc, str, i) => acc + str + (content.args[i] || ''), '')
    }

    dir(path: string) {
        let i18n = this;
        return {
            t: (key: string, options: any) => i18n.t(`${path}.${key}`, options),
            text: (key: string, options: any) => i18n.text(`${path}.${key}`, options),
            dir: (postPath: string) => i18n.dir(`${path}.${postPath}`)
        } as unknown as I18nDir;
    }

    locale(): string;
    locale(locale: string): Promise<void>;
    locale(locale?: string) {
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
        return Promise.all(map(this.sessions, session => session.locale(locale)));
    }

    private getFullPath(key: string) {
        return this.path ? `${this.path}.${key}` : key;
    }

    private getSession() {
        let parentProto = Proto.proto;
        if (parentProto) {
            let session = parentProto.global.i18n.session ?? new I18nSession(this);
            parentProto.global.i18n.session = session;
            return session;
        }
        else return this.session;
    }

    private readStoreLocale() {
        if (onclient()) this.#locale = localStorage.getItem(I18n.key) ?? this.defaultLocale;
    }
    
    private writeStoreLocale(locale: string) {
        if (onclient()) localStorage.setItem(I18n.key, locale);
    }
}

export interface I18n<D extends I18nDictionaryContext = {}> {
    add<F extends I18nDictionaryContext | I18nDictionaryContextImporter>(lang: string, dictionary: F): I18n<Mixin<D, (F extends I18nDictionaryContextImporter ? ResolvedAsyncDictionary<F> : F)>>;
    delete(lang: string): this;
    t<K extends I18nTranslationKey<D>, P extends I18nTranslationParams<K, D>>(path: K, ...params: P extends Record<string, never> ? [] : [P]): I18nTranslation;
    text<K extends I18nTranslationKey<D>, P extends I18nTranslationParams<K, D>>(path: K, ...params: P extends Record<string, never> ? [] : [P]): Promise<string>;
    dir<K extends I18nTranslationDirKey<D>>(path: K): I18nDir<GetDictionaryContextByKey<K, D>>
}

export interface I18nDir<D extends I18nDictionaryContext = {}> {
    t<K extends I18nTranslationKey<D>, P extends I18nTranslationParams<K, D>>(path: K, ...params: P extends Record<string, never> ? [] : [P]): I18nTranslation;
    text<K extends I18nTranslationKey<D>, P extends I18nTranslationParams<K, D>>(path: K, ...params: P extends Record<string, never> ? [] : [P]): Promise<string>;
    dir<K extends I18nTranslationDirKey<D>>(path: K): I18n<GetDictionaryContextByKey<K, D>>
}