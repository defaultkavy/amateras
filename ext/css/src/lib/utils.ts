import { randomId } from "amateras/lib/randomId";

const generatedIds = new Set<string>();
export const generateId = (lettercase: 'any' | 'lower' | 'upper' = 'any'): string => { 
    const id = randomId({lettercase: lettercase});
    if (generatedIds.has(id)) return generateId(lettercase);
    generatedIds.add(id);
    return id;
}