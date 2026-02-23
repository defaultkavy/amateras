import { I18n } from "#structure/I18n";
import { I18nTranslation as _I18nTranslation, I18nTranslation } from "#structure/I18nTranslation";
import { _instanceof, _null, _Object_assign } from "@amateras/utils";
import { GlobalState } from "@amateras/core";
import type { I18nSession } from "#structure/I18nSession";

declare global {
    export namespace $ {
        export function i18n(defaultLocale: string): I18n;
        export type I18nTranslation = _I18nTranslation;

        export interface TextProcessorValueMap {
            i18n: I18nTranslation
        }
    }

    export interface GlobalEventHandlersEventMap {
        localeupdate: Event;
    }
}

declare module '@amateras/core' {
    export interface GlobalState {
        i18n: {
            session: I18nSession | null
        }
    }
}

GlobalState.assign({
    i18n: {
        session: _null
    }
})

_Object_assign($, {
    i18n(defaultLocale: string) {
        return new I18n(defaultLocale)
    }
})

$.process.text.add(value => {
    if (_instanceof(value, I18nTranslation)) {
        return value
    }
})

export * from "#structure/I18n";
export * from "#structure/I18nDictionary";
export * from "#structure/I18nTranslation";
