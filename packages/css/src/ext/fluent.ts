import { $CSSFluent } from "#structure/$CSSFluent";
import { Utils } from "@amateras/utils";

declare global {
    export namespace $ {
        export namespace css {
            export function fluent<R extends $CSSFluent>(handle: (fluent: $CSSFluent) => R): ReturnType<R['proxy']>
        }
    }
}

Utils.assign($.css, {
    fluent(handle: (fluent: $CSSFluent) => $CSSFluent) {
        return handle(new $CSSFluent()).proxy();
    }
})

export * from '#structure/$CSSFluent'