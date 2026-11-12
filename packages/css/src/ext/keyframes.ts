import { cssGlobalRuleSet } from "#lib/cache";
import { createRule } from "#lib/createRule";
import { $CSSKeyframes } from "#structure/$CSSKeyframes";
import { Utils } from '@amateras/utils';

declare global {
    export namespace $ {
        export namespace css {
            export function keyframes<T extends $.CSSKeyframesMap>(options: T, name?: string): $CSSKeyframes;
            export function keyframesMap<T extends { [key: string]: $.CSSKeyframesMap }>(options: T): { [key in keyof T]: $CSSKeyframes };
        }

        export interface CSSValueMap {
            keyframes: $CSSKeyframes
        }
        
        export type CSSKeyframesMap = { [key: string]: $.CSSDeclarationMap } | { from?: $.CSSDeclarationMap, to?: $.CSSDeclarationMap }
    }
}

const KEYFRAMES_AT = '@keyframes ';

Utils.assign($.css, {
    keyframes(options: $.CSSKeyframesMap, name: string = 'keyframes') {
        let rule = createRule(() => `${KEYFRAMES_AT}${name}_${Utils.uid('css-keyframes')}`, options);
        cssGlobalRuleSet.add(rule);
        return new $CSSKeyframes(rule.selector.replace(`${KEYFRAMES_AT} `, ''));
    },
    keyframesMap(options: { [key: string]: $.CSSKeyframesMap }) {
        return Utils.fromEntries(
            Utils.map(
                Utils.entries(options), (([name, value]) => [name, $.css.keyframes(value, name)]) 
            )
        )
    }
})

export * from "#structure/$CSSKeyframes";
