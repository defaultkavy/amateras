import { ProxyProto } from "@amateras/core";
import { forEach } from "@amateras/utils";
import type { I18nSession } from "./I18nSession";

export class I18nTranslation extends ProxyProto {
    session: I18nSession;
    key: string;
    options: I18nTranslationOptions | undefined;
    constructor(session: I18nSession, key: string, options?: I18nTranslationOptions) {
        super()
        this.session = session;
        this.key = key;
        this.options = options;
        session.translations.add(this);
    }

    override dispose(): void {
        super.dispose();
        this.session.translations.delete(this)
    }
    
    override build(): this {
        this.update();
        return this;
    }
    
    async update() {
        const request = this.session.fetch(this.key, this.options);
        this.global.asyncTask(request);
        const {text, args} = await request;
        this.layout = () => {
            // make this array become Template String Array;
            //@ts-ignore
            text.raw = text;
            $(text as any, ...args);
        }
        forEach(this.protos, proto => proto.removeNode());
        super.build();
        this.node?.replaceWith(...this.toDOM());
        this.dispatch('i18nupdate', this, {bubbles: true})
        return this;
    }
}

export type I18nTranslationOptions = {[key: string]: any}