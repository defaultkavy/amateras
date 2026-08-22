import { Utils } from '@amateras/utils';
import type { I18nTranslationResult } from "../types";
import type { I18n } from "./I18n";
import type { I18nTranslation, I18nTranslationOptions } from "./I18nTranslation";
import { GlobalState, onclient } from "@amateras/core";
import type { Signal } from '@amateras/signal';

export class I18nSession {
    translations = new Set<I18nTranslation>()
    i18n: I18n;
    #locale: string = '';
    locale$: Signal<string> = $.signal(this.#locale);
    global: GlobalState;
    listeners = new Set<I18nSessionListener>();
    constructor(i18n: I18n, global: GlobalState) {
        this.i18n = i18n;
        this.global = global;
        this.locale(global.i18n.lang ?? i18n.locale());
        i18n.sessions.add(this);
    }
    
    async fetch(key: string, options?: I18nTranslationOptions, locale = this.#locale): Promise<I18nTranslationResult> {
        const dictionary = this.i18n.dictionaries.get(locale);
        if (!dictionary) return {text: [key], args: []};
        const translate = await dictionary.find(key);
        if (Utils.isUndefined(translate)) return {text: [key], args: []};
        const snippets = translate.split(/\$[a-zA-Z0-9_]+\$/);
        if (snippets.length === 1 || !options) return {text: [translate], args: []}
        const matches = translate.matchAll(/(\$([a-zA-Z0-9_]+)\$)/g);
        return {text: snippets, args: Utils.map(matches as unknown as [string, string, string][], ([,,value]) => options[value])}
    }
    
    locale(): string;
    locale(locale: string): Promise<void>;
    locale(locale?: string) {
        if (!arguments.length) return this.#locale;
        if (locale) {
            const localeKeys = this.i18n.dictionaries.keys().toArray();
            const langs = locale
                // Handle Accept-Language
                .split(',')
                .map(item => {
                    const [lang, q_str] = item.trim().split(';');
                    let q = 1;
                    if (q_str && q_str.startsWith('q=')) {
                        let parsed = parseFloat(q_str.trim().substring(2))
                        if (!isNaN(q)) q = parsed
                    }
                    return {lang: lang!.trim(), q}
                })
                .filter(item => item.q > 0)
                .sort((a, b) => b.q - a.q)

            locale = Utils.Undefined;
            const matcher = (lang: string) => {
                if (this.i18n.dictionaries.has(lang)) return lang;
                const baseLang = localeKeys.find(localeKey => localeKey.startsWith(lang));
                return baseLang;
            }
            for (let {lang} of langs) {
                locale = matcher(lang);
                if (locale) break;
                if (!lang.includes('-')) continue;
                lang = lang.split('-')[0]!;
                locale = matcher(lang);
                if (locale) break;
            }
        }
        if (locale && locale !== this.#locale) {
            this.#locale = locale;
            this.locale$.set(locale);
            return new Promise<void>(async (resolve) => {
                await Promise.all(Utils.map(this.translations, translation => translation.update()));
                resolve();
                if (onclient()) dispatchEvent(new Event('localeupdate'));
                Utils.forEach(this.listeners, listener => listener(this));
            })
        }
    }

    dispose() {
        this.global = Utils.Null as any;
        this.listeners = Utils.Null as any;
        this.i18n.sessions.delete(this);
        this.i18n = Utils.Null as any;
        this.translations = Utils.Null as any;
        this.locale$.dispose();
        this.locale$ = Utils.Null as any;
    }
}

export type I18nSessionListener = (session: I18nSession) => void;