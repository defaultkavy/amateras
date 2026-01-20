import { _instanceof, _null, map } from "@amateras/utils";
import { I18nDictionary } from "#structure/I18nDictionary";
import { I18nTranslation, type I18nTranslationOptions } from "./I18nTranslation";

export class I18n {
    map = new Map<string, I18nDictionary>();
    #defaultLocale: string;
    translations = new Set<I18nTranslation>();
    locale: string;
    constructor(defaultLocale: string) {
        this.#defaultLocale = defaultLocale;
        this.locale = defaultLocale;
    }

    defaultLocale(): string;
    defaultLocale(locale: string): this;
    defaultLocale(locale?: string) {
        if (!arguments.length) return this.#defaultLocale;
        if (locale) this.#defaultLocale = locale;
        return this;
    }

    async setLocale(): Promise<string>;
    async setLocale(locale: string): Promise<this>;
    async setLocale(locale?: string) {
        if (!arguments.length) return this.locale;
        if (locale) {
            let dictionary = this.map.get(locale);
            if (!dictionary) {
                locale = locale.split('-')[0]!;
                return this.setLocale(locale);
            }
            if (locale !== this.locale) {
                this.locale = locale;
                await Promise.all(map(this.translations, translation => translation.update()))
            }
        }
        return this;
    }

    dictionary(locale = this.locale) {
        if (!locale) return _null;
        const dictionary = this.map.get(locale);
        return dictionary;
    }

    translate(key: string, options?: I18nTranslationOptions) {
        return new I18nTranslation(this, key, options);
    }
}

