import { _instanceof } from "amateras/lib/native";
import { I18nText, type I18nTextOptions } from "#node/I18nText";
import { I18nDictionary } from "#structure/I18nDictionary";

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
        if (!arguments.length) return this.locale$();
        if (locale) this.locale$.set(locale)
        return this;
    }

    dictionary(locale = this.locale$()) {
        if (!locale) return null;
        const dictionary = this.map.get(locale);
        return dictionary;
    }

    translate(key: string, options?: I18nTextOptions) {
        return new I18nText(this, key, options);
    }
}

