import { isUndefined, map } from "@amateras/utils";
import type { I18nTranslationResult } from "../types";
import type { I18n } from "./I18n";
import type { I18nTranslation, I18nTranslationOptions } from "./I18nTranslation";
import { onclient } from "@amateras/core";

export class I18nSession {
    translations = new Set<I18nTranslation>()
    i18n: I18n;
    #locale: string;
    constructor(i18n: I18n) {
        this.i18n = i18n;
        this.#locale = i18n.locale();
        i18n.sessions.add(this);
    }
    
    async fetch(key: string, options?: I18nTranslationOptions): Promise<I18nTranslationResult> {
        const dictionary = this.i18n.dictionaries.get(this.#locale);
        if (!dictionary) return {text: [key], args: []};
        const translate = await dictionary.find(key);
        if (isUndefined(translate)) return {text: [key], args: []};
        const snippets = translate.split(/\$[a-zA-Z0-9_]+\$/);
        if (snippets.length === 1 || !options) return {text: [translate], args: []}
        const matches = translate.matchAll(/(\$([a-zA-Z0-9_]+)\$)/g);
        return {text: snippets, args: map(matches as unknown as [string, string, string][], ([,,value]) => options[value])}
    }
    
    locale(): string;
    locale(locale: string): Promise<void>;
    locale(locale?: string) {
        if (!arguments.length) return this.#locale;
        if (locale) {
            let dictionary = this.i18n.dictionaries.get(locale);
            if (!dictionary) {
                let splited = locale.split('-');
                if (splited.length === 1) return;
                return this.locale(splited[0]!);
            }
        }
        if (locale && locale !== this.#locale) {
            this.#locale = locale;
            return new Promise<void>(async (resolve) => {
                await Promise.all(map(this.translations, translation => translation.update()));
                resolve();
                if (onclient()) dispatchEvent(new Event('localeupdate'));
            })
        }
    }
}