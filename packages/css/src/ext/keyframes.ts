import { _Object_assign, _Object_fromEntries, _Object_entries, forEach, _Array_from, _instanceof, startsWith } from "amateras/lib/native";
import { $CSS, $CSSStyleRule, type $CSSDeclarations } from ".."
import { generateId } from "../lib/utils";
import { $CSSKeyframesRule } from "#structure/$CSSKeyframesRule";

declare module 'amateras/core' {
    export namespace $ {
        export namespace css {
            export function keyframes<T extends { [key: string]: $CSSKeyframesType }>(options: T): { [key in keyof T]: $CSSKeyframesRule };
        }

        export interface $CSSGlobalDeclarationExtendsMap {
            keyframes: $CSSKeyframesSelectorType;
        }

        export interface $CSSValueTypeExtendsMap {
            keyframes: $CSSKeyframesRule
        }
    }
}

export type $CSSKeyframesSelectorType = { [key: `@keyframes ${string}`]: $CSSKeyframesType }
export type $CSSKeyframesType = { [key: `${number}%`]: $CSSDeclarations } | { from?: $CSSDeclarations, to?: $CSSDeclarations }

const KEYFRAMES = '@keyframes'

$CSS.valueInstances.add($CSSKeyframesRule)

$CSS.cssTextProcessors.add((rule, context, options) => {
    if (_instanceof(rule, $CSSKeyframesRule)) 
        return [`${KEYFRAMES} ${rule.name} { ${_Array_from(rule.rules).map(childRule => $CSS.cssText(childRule, context, options)).join('\n')} }`]
})

$CSS.createRuleProcessors.add((selector, options) => {
    if (startsWith(selector, KEYFRAMES)) return createKeyframesRule(selector.replace('@keyframes ', ''), options as $CSSKeyframesType)
})

_Object_assign($.css, {
    keyframes(options: $CSSKeyframesType) {
        return _Object_fromEntries( _Object_entries(options).map(([name, value]) => {
            return [name, $CSS.insertRule( createKeyframesRule(`${name}_${generateId()}`, value) )];
        }) )
    }
})

const createKeyframesRule = (name: string, options: $CSSKeyframesType) => {
    const rule = new $CSSKeyframesRule(name);
    forEach(_Object_entries(options), ([key, value]) => {
        rule.rules.add( $CSS.CSSOptions(new $CSSStyleRule(key), value) );
    })
    return rule;
}

export * from '#structure/$CSSKeyframesRule'