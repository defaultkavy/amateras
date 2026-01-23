import type { I18n } from "#structure/I18n";
import { ProxyProto } from "@amateras/core/structure/ProxyProto";
import { forEach, isUndefined, map } from "@amateras/utils";

export class I18nTranslation extends ProxyProto {
    i18n: I18n;
    key: string;
    options: I18nTranslationOptions | undefined;
    constructor(i18n: I18n, key: string, options?: I18nTranslationOptions) {
        super()
        this.i18n = i18n;
        this.key = key;
        this.options = options;
        this.i18n.translations.add(this);
    }
    
    override build(): this {
        this.update();
        return this;
    }
    
    async update() {
        const {key, i18n, options} = this;
        const contentUpdate = (content: string[], args: any[] = []) => {
            this.layout = () => {
                // make this array become Template String Array;
                //@ts-ignore
                content.raw = content;
                $(content as any, ...args);
            }
            forEach(this.protos, proto => proto.removeNode());
            super.build();
            this.node?.replaceWith(...this.toDOM());
        }
        update: {
            const dictionary = i18n.dictionary();
            if (!dictionary) { contentUpdate([key]); break update }
            const request = dictionary.find(key);
            this.global.i18n.promises.push(request);
            const translate = await request;
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