import { cssGlobalRuleSet } from "#lib/cache";
import { createRule } from "#lib/createRule";
import { $CSSKeyframes } from "#structure/$CSSKeyframes";
import { _Object_assign, _Object_entries, _Object_fromEntries, map } from "@amateras/utils";
import { UID } from "@amateras/utils";

declare global {
    export namespace $ {
        export namespace css {
            export function keyframes<T extends { [key: string]: $.CSSKeyframesMap }>(options: T): { [key in keyof T]: $CSSKeyframes };
        }

        export interface CSSValueMap {
            keyframes: $CSSKeyframes
        }
        
        export type CSSKeyframesMap = { [key: string]: $.CSSDeclarationMap } | { from?: $.CSSDeclarationMap, to?: $.CSSDeclarationMap }
    }
}

const KEYFRAMES_AT = '@keyframes ';

_Object_assign($.css, {
    keyframes(options: $.CSSKeyframesMap) {
        return _Object_fromEntries(
            map(
                _Object_entries(options), (([name, value]) => {
                    let rule = createRule(() => `${KEYFRAMES_AT}${name}_${UID.generate('css-keyframes')}`, value);
                    cssGlobalRuleSet.add(rule);
                    return [name, new $CSSKeyframes(rule.selector.replace(`${KEYFRAMES_AT} `, ''))];
                }) 
            )
        )
    }
})

export * from "#structure/$CSSKeyframes";
