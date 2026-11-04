import { Utils } from "@amateras/utils";
import { $CSSSupport } from "../structure/$CSSSupport";

declare global {
    export namespace $ {
        export namespace css {
            export function support(value: $.CSSValue, fallback: $.CSSValue): $CSSSupport;
        }
    }
}

Utils.assign($.css, {
    support(value: $.CSSValue, fallback: $.CSSValue) {
        return new $CSSSupport(value, fallback)
    }
})