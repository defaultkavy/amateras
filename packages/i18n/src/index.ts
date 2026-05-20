import { I18n } from "#structure/I18n";
import { I18nTranslation as _I18nTranslation, I18nTranslation } from "#structure/I18nTranslation";
import { Utils } from '@amateras/utils';
import { GlobalState, Proto, ProxyProto } from "@amateras/core";
import type { I18nSession } from "#structure/I18nSession";

declare global {
    export namespace $ {
        export function i18n(defaultLocale: string): I18n;
        export type I18nTranslation = _I18nTranslation;

        export interface TextProcessorValueMap {
            i18n: I18nTranslation
        }

        export interface ProtoEventMap<P extends Proto> {
            i18nupdate: [I18nTranslation]
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

GlobalState.assign(() => ({
    i18n: {
        session: Utils.Null
    }
}))

GlobalState.disposers.add(global => {
    global.i18n.session = Utils.Null;
})

Utils.assign($, {
    i18n(defaultLocale: string) {
        return new I18n(defaultLocale)
    }
})

$.process.text.add(value => {
    if (Utils.isInstanceof(value, I18nTranslation)) {
        const $proxy = new ProxyProto();
        value.onupdate(result => {
            $proxy.layout = () => $([ ...result ]);
            Utils.forEach($proxy.protos, proto => proto.removeNode());
            $proxy.build();
            $proxy.node?.replaceWith(...$proxy.toDOM());
            $proxy.dispatch('i18nupdate', [this], {bubbles: true})
        })
        value.update();
        return $proxy;
    }
})
$.process.attr.add((name, value, proto) => {
    if (Utils.isInstanceof(value, I18nTranslation)) {
        value.onupdate((result) => {
            proto.attr(name, result.join(''))
        })
        value.update();
    }
})

export * from "#structure/I18n";
export * from "#structure/I18nDictionary";
export * from "#structure/I18nTranslation";
