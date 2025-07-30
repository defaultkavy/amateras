import { _Array_from } from "./native";

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = LOWER.toUpperCase();
export const randomId = (options?: {length?: number, lettercase?: 'any' | 'lower' | 'upper'}): string => { 
    options = {length: 5, lettercase: 'any', ...options};
    const char = options.lettercase === 'any' ? LOWER + UPPER : options.lettercase === 'lower' ? LOWER : UPPER;
    return _Array_from({length: options.length as number}, (_, i) => { 
        const rand = Math.round(Math.random() * char.length); return char[rand] 
    }).join(''); 
}