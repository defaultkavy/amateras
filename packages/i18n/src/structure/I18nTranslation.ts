import { Utils } from '@amateras/utils';
import type { I18nSession } from "./I18nSession";

export class I18nTranslation {
    session: I18nSession;
    key: string;
    options: I18nTranslationOptions | undefined;
    locale: string | undefined;
    private updating = false;
    private updaters: ((result: any[]) => void)[] = [];
    constructor(session: I18nSession, key: string, options?: I18nTranslationOptions, locale?: string) {
        this.session = session;
        this.key = key;
        this.options = options;
        this.session.translations.add(this);
        this.locale = locale;
    }
    
    async update() {
        if (this.updating) return;
        this.updating = true;
        const request = this.session.fetch(this.key, this.options, this.locale);
        this.session.global.asyncTask(request);
        const {text, args} = await request;
        const arr = Utils.map(text, (str, index) => index < args.length ? [str, args[index]] : [str]).flat();
        Utils.forEach(this.updaters, updaters => updaters(arr))
        this.updating = false;
        return this;
    }

    onupdate(handle: (result: any[]) => void) {
        this.updaters.push(handle);
    }
}

export type I18nTranslationOptions = {[key: string]: any}