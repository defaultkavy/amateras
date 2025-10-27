import { randomId } from "@amateras/utils";

const generatedIds = new Set<string>();
export const generateId = (lettercase: 'any' | 'lower' | 'upper' = 'any'): string => { 
    const id = randomId({lettercase: lettercase});
    if (generatedIds.has(id)) return generateId(lettercase);
    generatedIds.add(id);
    return id;
}

export const camelCaseToDash = (str: string) => str.replaceAll(/([A-Z])/g, ((_, $1: string) => `-${$1.toLowerCase()}`))