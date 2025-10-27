import '@amateras/signal';
import { _instanceof, _null } from "@amateras/utils";
import { I18nDictionary } from "#structure/I18nDictionary";
import { I18nTranslation, type I18nTranslationOptions } from "./I18nTranslation";

export class I18n {
    locale$ = $.signal<string>('');
    map = new Map<string, I18nDictionary>();
    #defaultLocale: string;
    constructor(defaultLocale: string) {
        this.#defaultLocale = defaultLocale;
        this.locale$.set(defaultLocale);
    }

    defaultLocale(): string;
    defaultLocale(locale: string): this;
    defaultLocale(locale?: string) {
        if (!arguments.length) return this.#defaultLocale;
        if (locale) this.locale$.set(locale);
        return this;
    }

    locale(): string;
    locale(locale: string): this;
    locale(locale?: string) {
        if (!arguments.length) return this.locale$.value();
        if (locale) {
            if (!this.map.has(locale)) locale = locale.split('-')[0]!;
            if (this.map.has(locale)) this.locale$.set(locale)
        }
        return this;
    }

    dictionary(locale = this.locale$.value()) {
        if (!locale) return _null;
        const dictionary = this.map.get(locale);
        return dictionary;
    }

    translate(key: string, options?: I18nTranslationOptions) {
        return new I18nTranslation(this, key, options);
    }
}

