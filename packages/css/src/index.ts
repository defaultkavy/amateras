import { cssGlobalRuleSet, cssRuleByProtoMap } from "#lib/cache";
import { createRule } from "#lib/createRule";
import { $CSSRule } from "#structure/$CSSRule";
import { onserver } from "@amateras/core/env";
import { ElementProto } from "@amateras/core/structure/ElementProto";
import type { Proto } from "@amateras/core/structure/Proto";
import { _Array_from, _instanceof, _Object_assign, _Object_entries, forEach, map } from "@amateras/utils";
import type { $CSSDeclarationMap } from "./types";
import { UID } from "@amateras/utils/structure/UID";

declare global {
    export namespace $ {
        /** Create CSS rule */
        export function css(cssObject: $.CSSMap | $CSSRule): $CSSRule;
        /** Create global CSS rules */
        export function CSS(cssRootObject: $.CSSRootMap): $CSSRule[];

        export type CSSValue = '' | 'unset' | 'initial' | 'inherit' | string & {} | number | $.CSSValueExtends;
        export type CSSValueExtends = ValueOf<CSSValueMap>;
        export interface CSSValueMap {}

        export interface AttrMap {
            css: $.CSSMap
        }

        export type CSSMap = { [key: string]: $.CSSMap | $.CSSValue } | $.CSSDeclarationMap;
        export type CSSDeclarationMap = { [key in keyof $CSSDeclarationMap]?: $CSSDeclarationMap[key] | $.CSSValue }
        export type CSSRootMap = { [key: string]: $.CSSMap };

        export namespace CSS {
            export function text(proto: Proto): string;
            export function rules(proto: Proto): $CSSRule[];
        }
    }
}

declare module "@amateras/core/structure/ElementProto" {
    export interface ElementProto {
        css(...cssObject: ($.CSSMap | $CSSRule)[]): this;
    }
}

// Assign methods to $ object
_Object_assign($, {

    css(cssMap: $.CSSMap | $CSSRule) {
        // If argument is $CSSRule, return it.
        if (_instanceof(cssMap, $CSSRule)) return cssMap;
        return createRule(() => `.${UID.generate('css')}`, cssMap);
    },
    
    CSS(cssRootMap: $.CSSRootMap) {
        // The CSS root object properties value should be $CSSObject,
        // just create rule from for each propperty.
        return map(_Object_entries(cssRootMap), ([key, value]) => {
            let rule = createRule(() => key, {...value, __selector__: key});
            cssGlobalRuleSet.add(rule);
            return rule;
        })
    },
})

_Object_assign(ElementProto.prototype, {
    css(this: ElementProto, ...cssMap: ($.CSSMap | $CSSRule)[]) {
        forEach(cssMap, cmap => assignCSS(this, cmap));
        return this;
    }
})

export const assignCSS = (proto: ElementProto, cssMap: $.CSSMap | $CSSRule) => {
    let rule = $.css(cssMap);
    let selector = rule.selector.slice(1);
    proto.addClass(selector);
    cssRuleByProtoMap.set(proto, rule);
}

// Assign html render methods to $.CSS
if (onserver()) {
    _Object_assign($.CSS, {
        rules(proto: Proto) {
            let ruleSet = new Set<$CSSRule>();

            forEach([proto, ...proto.protos], childProto => {
                let rule = cssRuleByProtoMap.get(childProto as any);
                if (rule) ruleSet.add(rule);
                if (proto !== childProto)
                    forEach(this.rules(childProto), rule => ruleSet.add(rule));
            })

            return _Array_from(ruleSet);
        },

        text(proto: Proto) {
            return [...cssGlobalRuleSet, ...this.rules(proto)].join('\n');
        }
    })
}

// Add processor of css attribute
$.process.attr.add((key, value, proto) => {
    if (key === 'css') return assignCSS(proto, value), true;
})

export * from "#structure/$CSS";
export * from "#structure/$CSSRule";

