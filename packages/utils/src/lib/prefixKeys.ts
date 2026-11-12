import { fromEntries, entries } from './object';
export const prefixKeys = <P extends string, T extends Record<string, any>>(prefix: P, object: T): {
    [key in keyof T & string as key extends '_' ? P : `${P}${key}`]: T[key]
} => 
    fromEntries(entries(object).map(([key, value]) => [key === '_' ? prefix : `${prefix}${key}`, value])) as any