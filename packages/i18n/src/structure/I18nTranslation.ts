import { _Array_from, _null, isUndefined } from "@amateras/utils";
import type { I18n } from "#structure/I18n";
import { $Node, type $NodeContentResolver, type $NodeContentTypes } from "@amateras/core/node/$Node";
import { $HTMLElement } from "@amateras/core/node/$HTMLElement";

export class I18nTranslation extends $HTMLElement {
    i18n: I18n;
    key: string;
    options: I18nTranslationOptions | undefined;
    content$ = $.signal('');
    constructor(i18n: I18n, key: string, options?: I18nTranslationOptions) {
        super('t')
        this.i18n = i18n;
        this.key = key;
        this.options = options;
        i18n.locale$.signal.subscribe(() => this.update())
        this.update();
    }
    
    async update() {
        const {key, i18n, options} = this;
        const contentUpdate = (content: $NodeContentResolver<this>) => {
            this.content(content);
            this.content$.set(this.textContent() ?? '')
        }
        update: {
            const dictionary = i18n.dictionary();
            if (!dictionary) { contentUpdate(key); break update }
            const target = await dictionary.find(key);
            if (isUndefined(target)) break update;
            const snippets = target.split(/\$[a-zA-Z0-9_]+\$/);
            if (snippets.length === 1 || !options) { contentUpdate(target); break update }
            const matches = target.matchAll(/(\$([a-zA-Z0-9_]+)\$)/g);
            const content = snippets.map(text => [text, options[matches.next().value?.at(2)!] ?? null]).flat();
            contentUpdate(content);
        }
        return this;
    }
}

export type I18nTranslationOptions = {[key: string]: any}