import { $CSSFluent } from "#structure/$CSSFluent";
import { Utils } from "@amateras/utils";

declare global {
    export namespace $ {
        export namespace css {
            export function fluent(initRule?: $.CSSDeclarationMap): $CSSFluent;
        }
    }
}

Utils.assign($.css, {
    fluent(initRule?: $.CSSDeclarationMap) {
        return new $CSSFluent(initRule);
    }
})

export * from '#structure/$CSSFluent'