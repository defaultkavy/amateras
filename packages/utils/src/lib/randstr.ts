import { arrayFrom } from "./array";

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = LOWER.toUpperCase();
export interface RandomIdOptions {
    length?: number;
    lettercase?: 'any' | 'lower' | 'upper';
}
export const randstr = (options?: RandomIdOptions): string => { 
    options = {length: 5, lettercase: 'any', ...options};
    const char = options.lettercase === 'any' ? LOWER + UPPER : options.lettercase === 'lower' ? LOWER : UPPER;
    return arrayFrom({length: options.length as number}, (_, i) => char[Math.round(Math.random() * char.length)]).join(''); 
}