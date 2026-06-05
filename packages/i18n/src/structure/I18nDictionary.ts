import { onclient } from "@amateras/core";
import { Utils } from '@amateras/utils';
import type { I18nDictionaryContext, I18nDictionaryContextImporter } from "../types";

export class I18nDictionary {
    #context: I18nDictionaryContext | Promise<I18nDictionaryContext> | null = null;
    #fetch: I18nDictionaryContextImporter | null = null;
    constructor(resolver: I18nDictionaryContext | I18nDictionaryContextImporter) {
        if (Utils.isFunction(resolver)) this.#fetch = resolver;
        else this.#context = resolver;
    }

    async context(): Promise<I18nDictionaryContext> {
        let dispatchEvent = () => onclient() && window.dispatchEvent(new Event('i18ncontext'));
        if (this.#context) {
            if (Utils.isAsyncFunction(this.#context))
                return await (this.#context as Promise<I18nDictionaryContext>)
                    .finally(dispatchEvent);
            else return this.#context;
        }
        if (!this.#fetch) throw 'I18n Context Fetch Error';
        return this.#context = this.#fetch()
            .then((module) => module.default)
            .finally(dispatchEvent);
    }

    async find(path: string, context?: I18nDictionaryContext): Promise<string | undefined> {
        if (!context) context = await this.context();
        const [snippet, ...rest] = path.split('.') as [string, ...string[]];
        const target = context[snippet];
        if (Utils.isFunction(target)) {
            const context = await target().then(mod => mod.default);
            if (rest.length) return this.find(rest.join('.'), context);
            return context['_'] as string;
        }
        if (Utils.isObject(target)) {
            if (rest.length) return this.find(rest.join('.'), target);
            return target['_'] as string;
        } 
        if (rest.length) return path;
        return target;
    }
}