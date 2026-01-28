import { $CSSVariable } from "#structure/$CSSVariable";
import { _Object_assign, _Object_entries, _Object_fromEntries, isObject, map } from "@amateras/utils";
import { camelCaseToDash } from "../lib/utils";
import { UID } from "@amateras/utils";

declare global {
    export namespace $ {
        export namespace css {
            export function variable<V extends string>(value: V): $CSSVariable<V>;
            export function variable<T extends $.CSSVariableType>(options: T): { [key in keyof T]: $CSSVariable<T[key]> }
        }
        
        export interface CSSValueMap {
            variable: $CSSVariable
        }

        export type CSSVariableType<T = any> = { [key in keyof T]: $.CSSValue }
    }
}


_Object_assign($.css, {
    variable<T extends $.CSSVariableType | string>(options: T) {
        let id = UID.generate('css-variable', {lettercase: 'lower'})
        if (isObject(options)) {
            const variables = _Object_fromEntries(
                map(_Object_entries(options), (([key, value]) => [
                    key, new $CSSVariable(`--${camelCaseToDash(key)}_${id}`, `${value}`)
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
            const variable = new $CSSVariable(`--${id}`, options);
            $.CSS({':root': {[variable.name]: variable.value}});
            return variable;
        }
    }
})

export * from "#structure/$CSSVariable";
