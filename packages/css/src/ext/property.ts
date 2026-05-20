import { cssGlobalRuleSet } from "#lib/cache";
import { createRule } from "#lib/createRule";
import { camelCaseToDash } from "#lib/utils";
import { $CSSProperty } from "#structure/$CSSProperty";
import { UID, Utils } from '@amateras/utils';

declare global {
    export namespace $ {
        export namespace css {
            export function property<T extends $.CSSPropertyMap>(resolver: T): { [key in keyof T]: $CSSProperty }
            export function property(syntax: $.CSSPropertySyntax, initialValue: string | number, inherits?: boolean): $CSSProperty
        }

        export interface CSSValueMap {
            property: $CSSProperty
        }

        export type CSSPropertySyntax = 
        '<angle>' | '<color>' | '<custom-ident>' | 
        '<image>' | '<integer>' | '<length>' | 
        '<length-percentage>' | '<number>' | '<percentage>' | 
        '<resolution>' | '<string>' | '<time>' | 
        '<transform-function>' | '<transform-list>' | '<url>' |
        'auto' | '*' | string & {}

        export type CSSPropertyMap = { 
            [key: string]: 
                [syntax: $.CSSPropertySyntax, initialValue?: string | number, inherits?: boolean]
                | [syntax: '*']
        } 
    }
}

Utils.assign($.css, {
    property(resolver: $.CSSPropertyMap | string, initialValue?: string | number, inherits?: boolean) {
        let id = UID.generate('css-property', {lettercase: 'lower'})
        if (Utils.isString(resolver)) {
            if (Utils.isUndefined(initialValue) || Utils.isUndefined(inherits)) throw 'Register CSS Property Error';
            let name = `--${id}`;
            let property = new $CSSProperty({ name, syntax: resolver, initialValue: `${initialValue}`, inherits });
            let rule = createRule(() => `@property ${name}`, {
                syntax: `'${resolver}'`,
                inherits: `${inherits ?? true}`,
                ...(initialValue ? { initialValue } : {})
            }, false)
            cssGlobalRuleSet.add(rule)
            return property;
        } else {
            let propertyMap = {};
            Utils.forEach(Utils.entries(resolver), ([key, [syntax, initialValue, inherits]]) => {
                let name = `--${camelCaseToDash(key)}-${id}`
                let property = new $CSSProperty({ name, syntax, initialValue: `${initialValue}`, inherits });
                Utils.assign(propertyMap, { [key]: property });
                let rule = createRule(() => `@property ${name}`, {
                    syntax: `'${syntax}'`,
                    inherits: `${inherits ?? true}`,
                    ...(initialValue ? { initialValue } : {})
                }, false)
                cssGlobalRuleSet.add(rule)
            })
            return propertyMap;
        }
    }
})

export * from "#structure/$CSSProperty";
