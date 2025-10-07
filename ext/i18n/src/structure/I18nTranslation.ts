import { _Array_from, _null, isUndefined } from "amateras/lib/native";
import type { I18n } from "#structure/I18n";

export class I18nTranslation {
    i18n: I18n;
    key: string;
    options: I18nTranslationOptions | undefined;
    content$ = $.signal('');
    constructor(i18n: I18n, key: string, options?: I18nTranslationOptions) {
        this.i18n = i18n;
        this.key = key;
        this.options = options;
        i18n.locale$.signal.subscribe(() => this.update())
        this.update();
    }
    
    async update() {
        const {key, i18n, options} = this;
        const contentUpdate = (content: string) => this.content$.set(content);
        update: {
            const dictionary = i18n.dictionary();
            if (!dictionary) { contentUpdate(key); break update }
            const target = await dictionary.find(key);
            if (isUndefined(target)) break update;
            const snippets = target.split(/\$[a-zA-Z0-9_]+\$/);
            if (snippets.length === 1 || !options) { contentUpdate(target); break update }
            const matches = target.matchAll(/(\$([a-zA-Z0-9_]+)\$)/g);
            const content = snippets.map(text => [text, options[matches.next().value?.at(2)!] ?? null]).join('');
            contentUpdate(content);
        }
        return this;
    }
}

export type I18nTranslationOptions = {[key: string]: any}