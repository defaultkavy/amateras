import { _Object_assign, _Object_entries, _Object_fromEntries, isObject } from "@amateras/utils";
import { $CSS, type $CSSValueType } from "..";
import { camelCaseToDash, generateId } from "../lib/utils";
import { $CSSVariable } from "#structure/$CSSVariable";

declare module '@amateras/core' {
    export namespace $ {
        export namespace css {
            export function variable<V extends string>(value: V): $CSSVariable<V>;
            export function variable<T extends $CSSVariableType>(options: T, conditions?: $CSSVariableConditionType<T>): { [key in keyof T]: $CSSVariable<T[key]> }
        }
        
        export interface $CSSValueTypeExtendsMap {
            variable: $CSSVariable
        }
    }
}

export type $CSSVariableType<T = any> = { [key in keyof T]: $CSSValueType }
export type $CSSVariableConditionType<T extends $CSSVariableType | string> = T extends string ? { [key: string]: $CSSValueType } : { [key: string]: Partial<$CSSVariableType<T>> }

$CSS.valueInstances.add($CSSVariable)

_Object_assign($.css, {
    variable<T extends $CSSVariableType | string>(options: T, conditions?: $CSSVariableConditionType<T>) {
        if (isObject(options)) {
            const variables = _Object_fromEntries(_Object_entries(options).map(([key, value]) => [
                key, 
                new $CSSVariable(`--${camelCaseToDash(key)}_${generateId('lower')}`, `${value}`)
            ]))

            const conditionObj = conditions ? _Object_entries(conditions).map(([condition, _options]) => [
                condition,
                _Object_fromEntries(_Object_entries(_options).map(([key, value]) => [`${variables[key]?.name}`, `${value}`] as const))
            ] as const) : [];

            $.CSS({':root': {
                ..._Object_fromEntries(_Object_entries(variables).map(([_, {name, value}]) => [name, value])),
                ..._Object_fromEntries(conditionObj)
            }})

            return variables;
        } else {
            const variable = new $CSSVariable(`--${generateId('lower')}`, options);
            $.CSS({':root': {[variable.name]: variable.value}});
            return variable;
        }
    }
})

export * from '#structure/$CSSVariable'