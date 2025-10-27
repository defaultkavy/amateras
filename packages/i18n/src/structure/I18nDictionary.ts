import { _instanceof, isFunction, isObject } from "@amateras/utils";

export class I18nDictionary {
    #context: I18nDictionaryContext | Promise<I18nDictionaryContext> | null = null;
    #fetch: I18nDictionaryContextImporter | null = null;
    constructor(resolver: I18nDictionaryContext | I18nDictionaryContextImporter) {
        if (isFunction(resolver)) this.#fetch = resolver;
        else this.#context = resolver;
    }

    async context(): Promise<I18nDictionaryContext> {
        if (this.#context) return await this.#context;
        if (!this.#fetch) throw 'I18n Context Fetch Error';
        return this.#context = this.#fetch().then((module) => module.default);
    }

    async find(path: string, context?: I18nDictionaryContext): Promise<string | undefined> {
        if (!context) context = await this.context();
        const [snippet, ...rest] = path.split('.') as [string, ...string[]];
        const target = context[snippet];
        if (isObject(target)) {
            if (rest.length) return this.find(rest.join('.'), target);
            else return target['_'] as string;
        } 
        if (rest.length) return path;
        else return target;
    }
}

export type I18nDictionaryContext = {[key: string]: string | I18nDictionaryContext}
export type I18nDictionaryContextImporter = () => Promise<{default: I18nDictionaryContext}>