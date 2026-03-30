import { $CSSVariable } from "#structure/$CSSVariable";
import { _Object_assign, _Object_entries, _Object_fromEntries, isObject, map } from "@amateras/utils";
import { camelCaseToDash } from "../lib/utils";
import { UID } from "@amateras/utils";

declare global {
    export namespace $ {
        export namespace css {
            export function variable<V extends string>(value: V): $CSSVariable<V>;
            export function variable<T extends $.CSSVariableType>(varMap: T, options?: $CSSVariableOptions): { [key in keyof T]: $CSSVariable<T[key]> }
        }
        
        export interface CSSValueMap {
            variable: $CSSVariable<string | number>
        }

        export type CSSVariableType<T = any> = { [key in keyof T]: $.CSSValue }
    }
}

export interface $CSSVariableOptions {
    unique?: boolean,
    prefix?: string
}

_Object_assign($.css, {
    variable<T extends $.CSSVariableType | string>(varMap: T, options?: $CSSVariableOptions) {
        let id = options?.unique ? '_' + UID.generate('css-variable', {lettercase: 'lower'}) : '';
        if (isObject(varMap)) {
            const variables = _Object_fromEntries(
                map(_Object_entries(varMap), (([key, value]) => [
                    key, new $CSSVariable(`--${options?.prefix ?? ''}${camelCaseToDash(key)}${id}`, `${value}`)
                ])
            ))

            $.CSS({
                ':root': _Object_fromEntries(
                    map(_Object_entries(variables), (
                        ([_, {name, value}]) => [
                            name, value
                        ])
                    )
                )
            })

            return variables;
        } else {
            const variable = new $CSSVariable(`--${id}`, varMap);
            $.CSS({':root': {[variable.name]: variable.value}});
            return variable;
        }
    }
})

export * from "#structure/$CSSVariable";
