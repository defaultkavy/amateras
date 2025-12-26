import { _Object_assign, _Object_fromEntries, _Object_entries, forEach, _Array_from, _instanceof, startsWith, map } from "@amateras/utils";
import { generateId } from "../lib/utils";
import { $CSSKeyframes } from "#structure/$CSSKeyframes";
import { createRule } from "#lib/createRule";
import { cssGlobalRuleSet } from "#lib/cache";

declare module '@amateras/core' {
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
                    let rule = createRule(() => `${KEYFRAMES_AT}${name}_${generateId()}`, value);
                    cssGlobalRuleSet.add(rule);
                    return [name, new $CSSKeyframes(rule.selector.replace(`${KEYFRAMES_AT} `, ''))];
                }) 
            )
        )
    }
})