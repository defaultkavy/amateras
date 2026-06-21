import { cssGlobalRuleSet, cssRuleByProtoMap } from "#lib/cache";
import { createRule } from "#lib/createRule";
import { $CSSRule } from "#structure/$CSSRule";
import { ElementProto, GlobalState, Proto, onclient, onserver } from "@amateras/core";
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

        export type CSSMap = { [key: string]: OrArray<$.CSSMap> | $.CSSValue } | $.CSSDeclarationMap;
        export type CSSDeclarationMap = { [key in keyof $CSSDeclarationMap]?: $CSSDeclarationMap[key] | $.CSSValue }
        export type CSSRootMap = { [key: string]: $.CSSMap };

        export namespace CSS {
            export function text(proto: Proto): string;
            export function rules(proto: Proto): $CSSRule[];
            export function imports(syntax: string[], proto?: Proto): $CSSRule;
        }

        export interface AttrMap<T> {
            css: OrMatrix<$.CSSMap | $CSSRule>;
        }
    }
}

declare module "@amateras/core" {
    export interface ElementProto {
        css(...cssObject: (OrArray<$.CSSMap | $CSSRule>)[]): this;
    }

    export interface GlobalState {
        css: {
            rules: $CSSRule[]
        }
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
    css(this: ElementProto, ...cssMap: (OrArray<$.CSSMap | $CSSRule>)[]) {
        Utils.forEach(mergeMaps(cssMap), map => assignCSS(this, map));
        return this;
    }
})

// Assign GlobalState css
GlobalState.assign(() => ({
    css: {
        rules: []
    }
}))

GlobalState.disposers.add(({css}) => {
    css.rules = [];
})

const mergeMaps = (maps: ($.CSSMap | $CSSRule)[]): ($.CSSMap | $CSSRule)[] => {
    let merge = {};
    let processedMaps: ($.CSSMap | $CSSRule)[] = [merge];
    Utils.forEach(maps, map => {
        // resolve matrix map
        if (Utils.isArray(map)) {
            let [mergedMap, ...rules] = mergeMaps(map);
            Utils.assign(merge, mergedMap);
            processedMaps.push(...rules);
        }
        else if (Utils.isInstanceof(map, $CSSRule)) processedMaps.push(map);
        else merge = Utils.assign(merge, map)
    })
    return processedMaps;
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
    },

    imports(syntax: string[], proto = Proto.proto) {
        const rules = Utils.map(syntax, syntax => new $CSSRule(`@import ${syntax}`))
        if (proto) proto.global.css.rules.push(...rules);
        else Utils.forEach(rules, rule => cssGlobalRuleSet.add(rule));

        if (onclient()) {
            Utils.forEach(rules, rule => {
                const $style = document.createElement('style');
                $style.innerHTML = `${rule}`;
                document.head.append($style);
            })
        }
    }
})

if (onclient()) {
    // detect touch and set html[<pointer-type>] attribute
    const listen = (type: 'pointermove' | 'pointerdown') => {
        addEventListener(type, (e: PointerEvent) => {
            if (e.pointerType === 'touch') document.documentElement.setAttribute('touch', '');
            else document.documentElement.removeAttribute('touch');
        })
    }
    listen('pointerdown');
    listen('pointermove');
}

// Add processor of css attribute
$.middleware.attr.add((key, value, proto) => {
    if (key === 'css') {
        Utils.forEach(mergeMaps(Utils.toArray(value)), map => assignCSS(proto, map));
        return true;
    }
})

if (onserver()) $.middleware.ssr.add(($html, $head) => {
    let cssText = ''
    Utils.forEach($.styleMap, ([constructor, css]) => {
        if ($html.findBelow(proto => proto.constructor === constructor)) Utils.forEach(css, rule => cssText += rule);
    })
    cssText += $.CSS.text($html);
    if (cssText.length) {
        const $style = $.context($head, () => $.craft('style', {id: '__ssr__'}, () => $([ cssText ])));
        $head.append($style);
        $style.build();
    }
})

export * from "#structure/$CSS";
export * from "#structure/$CSSRule";
export * from "./types";
