import { _Array_from, _null, forEach, isUndefined, map } from "@amateras/utils";
import type { I18n } from "#structure/I18n";
import { $Node } from "@amateras/core/node/$Node";

export class I18nTranslation extends $Node<HTMLElement> {
    i18n: I18n;
    key: string;
    options: I18nTranslationOptions | undefined;
    constructor(i18n: I18n, key: string, options?: I18nTranslationOptions) {
        super('t')
        this.i18n = i18n;
        this.key = key;
        this.options = options;
        
        this.ondom(node => {
            this.update(node);
            i18n.locale$.signal.subscribe(() => this.update(node))
        })
    }
    
    protected async update(node: HTMLElement) {
        const {key, i18n, options} = this;
        const contentUpdate = (content: string[], args: any[] = []) => {
            const layout = $.layout(() => $(content as unknown as TemplateStringsArray, ...args));
            node.replaceChildren();
            node.append(...layout.build('dom'));
        }
        update: {
            const dictionary = i18n.dictionary();
            if (!dictionary) { contentUpdate([key]); break update }
            const translate = await dictionary.find(key);
            if (isUndefined(translate)) break update;
            const snippets = translate.split(/\$[a-zA-Z0-9_]+\$/);
            if (snippets.length === 1 || !options) { contentUpdate([translate]); break update }
            const matches = translate.matchAll(/(\$([a-zA-Z0-9_]+)\$)/g);
            contentUpdate(snippets, map(matches as unknown as [string, string, string][], ([,,value]) => options[value]));
        }
        return this;
    }
}

export type I18nTranslationOptions = {[key: string]: any}