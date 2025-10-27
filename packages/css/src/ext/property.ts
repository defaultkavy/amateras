import { camelCaseToDash, generateId } from "#lib/utils";
import { $CSSProperty } from "#structure/$CSSProperty";
import { $CSS } from "..";
import { _instanceof, _Object_assign, _Object_entries, forEach, isString, isUndefined } from "@amateras/utils";

declare module '@amateras/core' {
    export namespace $ {
        export namespace css {
            export function property<T extends $CSSPropertyMap>(resolver: T): { [key in keyof T]: $CSSProperty }
            export function property(syntax: $CSSPropertySyntax, initialValue: string | number, inherits: boolean): $CSSProperty
        }

        export interface $CSSValueTypeExtendsMap {
            property: $CSSProperty
        }
    }
}

export type $CSSPropertySyntax = 
'<angle>' | '<color>' | '<custom-ident>' | 
'<image>' | '<integer>' | '<length>' | 
'<length-percentage>' | '<number>' | '<percentage>' | 
'<resolution>' | '<string>' | '<time>' | 
'<transform-function>' | '<transform-list>' | '<url>' |
'auto' | '*' | string & {}

export type $CSSPropertyMap = { [key: string]: [$CSSPropertySyntax, string | number, boolean] }

_Object_assign($.css, {
    property(resolver: $CSSPropertyMap | string, initialValue?: string | number, inherits?: boolean) {
        if (isString(resolver)) {
            if (isUndefined(initialValue) || isUndefined(inherits)) throw 'Register CSS Property Error';
            const property = new $CSSProperty({ name: `--${generateId('lower')}`, syntax: resolver, initialValue: `${initialValue}`, inherits });
            CSS.registerProperty(property)
            return property;
        } else {
            const obj = {};
            forEach(_Object_entries(resolver), ([key, [syntax, initialValue, inherits]]) => {
                const property = new $CSSProperty({ name: `--${camelCaseToDash(key)}-${generateId('lower')}`, syntax, initialValue: `${initialValue}`, inherits });
                _Object_assign(obj, { [key]: property });
                CSS.registerProperty(property)
            })
            return obj;
        }
    }
})

$CSS.valueInstances.add($CSSProperty);