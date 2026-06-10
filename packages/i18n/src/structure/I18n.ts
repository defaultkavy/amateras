import { I18nTranslation } from "./I18nTranslation";
import { I18nSession } from "./I18nSession";
import { onclient, Proto } from "@amateras/core";
import type { I18nTranslationKey, I18nTranslationParams, MixinDictionaryContext, ResolvedAsyncDictionary, I18nTranslationDirKey, GetDictionaryContextByKey, I18nDictionaryContext, I18nDictionaryContextImporter } from "../types";
import { Utils } from '@amateras/utils';
import { I18nDictionary } from "./I18nDictionary";

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

    t<K extends I18nTranslationKey<D>, P extends I18nTranslationParams<K, D, L>>(path: K, ...params: P): I18nTranslation;
    t(key: string, ...args: any[]) {
        return new I18nTranslation(this.session, this.getFullPath(key), ...args);
    }

    async text<K extends I18nTranslationKey<D>, P extends I18nTranslationParams<K, D, L>>(path: K, ...params: P): Promise<string>;
    async text(key: string, ...args: any[]) {
        const [arg1, arg2] = args;
        let content = await this.session.fetch(this.getFullPath(key), ...(Utils.isString(arg1) ? [Utils.Undefined, arg1] : [arg1, arg2]))
        return content.text.reduce((acc, str, i) => acc + str + (content.args[i] || ''), '')
    }

    dir(path: string) {
        let i18n = this;
        return {
            //@ts-ignore
            t: (key: string, options?: any, locale?: string) => i18n.t(`${path}.${key}`, options, locale),
            //@ts-ignore
            text: (key: string, options?: any, locale?: string) => i18n.text(`${path}.${key}`, options, locale),
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
    add<F extends I18nDictionaryContext | I18nDictionaryContextImporter, T extends string>(lang: T, dictionary: F): I18n<Prettify<MixinDictionaryContext<D, (F extends I18nDictionaryContextImporter ? ResolvedAsyncDictionary<F> : F)>>, [...L, T]>;
    delete(lang: string): this;
    t<K extends I18nTranslationKey<D>, P extends I18nTranslationParams<K, D, L>>(path: K, ...params: P): I18nTranslation;
    text<K extends I18nTranslationKey<D>, P extends I18nTranslationParams<K, D, L>>(path: K, ...params: P): Promise<string>;
    dir<K extends I18nTranslationDirKey<D>>(path: K): I18nDir<GetDictionaryContextByKey<K, D>, L>
}

export interface I18nDir<D extends I18nDictionaryContext = {}, L extends string[] = []> {
    t<K extends I18nTranslationKey<D>, P extends I18nTranslationParams<K, D, L>>(path: K, ...params: P): I18nTranslation;
    text<K extends I18nTranslationKey<D>, P extends I18nTranslationParams<K, D, L>>(path: K, ...params: P): Promise<string>;
    dir<K extends I18nTranslationDirKey<D>>(path: K): I18n<GetDictionaryContextByKey<K, D>>
}