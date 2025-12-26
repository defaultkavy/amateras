import { cssGlobalRuleSet } from "#lib/cache";
import { createRule } from "#lib/createRule";
import { camelCaseToDash, generateId } from "#lib/utils";
import { $CSSProperty } from "#structure/$CSSProperty";
import { _instanceof, _Object_assign, _Object_entries, _undefined, forEach, isString, isUndefined } from "@amateras/utils";

declare module '@amateras/core' {
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
                [$.CSSPropertySyntax, string | number, boolean]
                | [$.CSSPropertySyntax, string | number]
                | ['*']
        } 
    }
}

_Object_assign($.css, {
    property(resolver: $.CSSPropertyMap | string, initialValue?: string | number, inherits?: boolean) {
        if (isString(resolver)) {
            if (isUndefined(initialValue) || isUndefined(inherits)) throw 'Register CSS Property Error';
            let name = `--${generateId('lower')}`;
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
            forEach(_Object_entries(resolver), ([key, [syntax, initialValue, inherits]]) => {
                let name = `--${camelCaseToDash(key)}-${generateId('lower')}`
                let property = new $CSSProperty({ name, syntax, initialValue: `${initialValue}`, inherits });
                _Object_assign(propertyMap, { [key]: property });
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