import { _Array_from, isUndefined } from "amateras/lib/native";
import { $HTMLElement } from "amateras/node/$HTMLElement";
import type { I18n } from "#structure/I18n";

export class I18nText extends $HTMLElement<HTMLElement, { i18nupdate: Event }> {
    i18n: I18n;
    key: string;
    options: I18nTextOptions | undefined;
    constructor(i18n: I18n, key: string, options?: I18nTextOptions) {
        super('text');
        this.i18n = i18n;
        this.key = key;
        this.options = options;
        i18n.locale$.signal.subscribe(() => this.update())
        this.update();
    }
    
    async update() {
        update: {
            const {key, i18n} = this;
            const dictionary = i18n.dictionary();
            if (!dictionary) {this.content(key); break update}
            const target = await dictionary.find(key);
            if (isUndefined(target)) break update;
            const snippets = target.split(/\$[a-zA-Z0-9_]+\$/);
            if (snippets.length === 1 || !this.options) {this.content(target); break update}
            const matches = target.matchAll(/(\$([a-zA-Z0-9_]+)\$)/g);
            this.content(snippets.map(text => [text, this.options?.[matches.next().value?.at(2)!] ?? null]));
        }
        this.dispatchEvent(new Event('i18nupdate'));
        return this;
    }
}

export type I18nTextOptions = {[key: string]: any}