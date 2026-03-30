import { _Object_entries, isObject } from "@amateras/utils";

export type CSSMap = Partial<CSSStyleDeclaration> & {[key: string]: CSSMap | string}

export const toCSS = (selector: string, map: CSSMap): string => {
    let text = [];
    for (let [key, value] of _Object_entries(map)) {
        if (isObject(value)) text.push(toCSS(key, value as any));
        else text.push(`${key.replaceAll(/[A-Z]/g, $1 => `-${$1.toLowerCase()}`)}: ${value};`);
    }
    return `${selector} { ${text.join(' ')} }`
}