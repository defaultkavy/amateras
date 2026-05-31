import { cssGlobalRuleSet, cssRuleByProtoMap } from "#lib/cache";
import { createRule } from "#lib/createRule";
import { $CSSRule } from "#structure/$CSSRule";
import { ElementProto, type Proto, onclient, onserver } from "@amateras/core";
import { UID, Utils } from '@amateras/utils';
import type { $CSSDeclarationMap } from "./types";

declare global {
    export namespace $ {
        /** Create CSS rule */
        export function css(cssObject: $.CSSMap | $CSSRule): $CSSRule;
        /** Create global CSS rules */
        export function CSS(cssRootObject: $.CSSRootMap): $CSSRule[];

        export type CSSValue = '' | 'unset' | 'initial' | 'inherit' | string & {} | number | $.CSSValueExtends;
        export type CSSValueExtends = ValueOf<CSSValueMap>;
        export interface CSSValueMap {}

        export type CSSMap = { [key: string]: $.CSSMap | $.CSSValue } | $.CSSDeclarationMap;
        export type CSSDeclarationMap = { [key in keyof $CSSDeclarationMap]?: $CSSDeclarationMap[key] | $.CSSValue }
        export type CSSRootMap = { [key: string]: $.CSSMap };

        export namespace CSS {
            export function text(proto: Proto): string;
            export function rules(proto: Proto): $CSSRule[];
        }

        export interface AttrMap<T> {
            css: OrArray<$.CSSMap | $CSSRule>;
        }
    }
}

declare module "@amateras/core" {
    export interface ElementProto {
        css(...cssObject: ($.CSSMap | $CSSRule)[]): this;
    }
}

// Assign methods to $ object
Utils.assign($, {

    css(cssMap: $.CSSMap | $CSSRule) {
        // If argument is $CSSRule, return it.
        if (Utils.isInstanceof(cssMap, $CSSRule)) return cssMap;
        return createRule(() => `.${UID.generate('css')}`, cssMap);
    },
    
    CSS(cssRootMap: $.CSSRootMap) {
        // The CSS root object properties value should be $CSSObject,
        // just create rule from for each propperty.
        return Utils.map(Utils.entries(cssRootMap), ([key, value]) => {
            // __selector__ record the selector key
            let rule = createRule(() => key, {...value, __selector__: key});
            cssGlobalRuleSet.add(rule);
            return rule;
        })
    },
})

Utils.assign(ElementProto.prototype, {
    css(this: ElementProto, ...cssMap: ($.CSSMap | $CSSRule)[]) {
        mergeMaps(cssMap, this)
        return this;
    }
})

const mergeMaps = (maps: OrArray<($.CSSMap | $CSSRule)[]>, proto: ElementProto) => {
    let merge: null | {} = Utils.Null;
    Utils.forEach(Utils.toArray(maps), map => {
        if (Utils.isInstanceof(map, $CSSRule)) assignCSS(proto, map);
        else merge = Utils.assign(merge ?? {}, map)
    })
    if (!Utils.isNull(merge)) assignCSS(proto, merge);
}

const assignCSS = (proto: ElementProto, cssMap: $.CSSMap | $CSSRule) => {
    let rule = $.css(cssMap);
    let selector = rule.selector.slice(1);
    proto.addClass(selector);
    const ruleSet = cssRuleByProtoMap.get(proto) ?? new Set();
    ruleSet.add(rule);
    cssRuleByProtoMap.set(proto, ruleSet);
}

// Assign html render methods to $.CSS
if (onserver()) {
    Utils.assign($.CSS, {
        rules(proto: Proto) {
            let ruleSet = new Set<$CSSRule>();

            Utils.forEach([proto, ...proto.protos], childProto => {
                let protoCSSRules = cssRuleByProtoMap.get(childProto as any);
                Utils.forEach(protoCSSRules, rule => ruleSet.add(rule));
                if (proto !== childProto)
                    Utils.forEach(this.rules(childProto), rule => ruleSet.add(rule));
            })

            return Utils.arrayFrom(ruleSet);
        },

        text(proto: Proto) {
            return [...cssGlobalRuleSet, ...this.rules(proto)].join('\n');
        }
    })
}

if (onclient()) {
    // detect touch and set html[touch] attribute
    addEventListener('touchstart', () => document.documentElement.setAttribute('touch', ''), { passive: true })
    addEventListener('mousemove', () => document.documentElement.removeAttribute('touch'), { passive: true })
}

// Add processor of css attribute
$.process.attr.add((key, value, proto) => {
    if (key === 'css') {
        mergeMaps(value, proto);
        return true;
    }
})

export * from "#structure/$CSS";
export * from "#structure/$CSSRule";
export * from "./types";
