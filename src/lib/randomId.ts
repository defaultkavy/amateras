const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = LOWER.toUpperCase();
export function randomId(options?: {length?: number, case?: 'any' | 'lower' | 'upper'}): string { 
    options = {length: 5, case: 'any', ...options};
    const char = options.case === 'any' ? LOWER + UPPER : options.case === 'lower' ? LOWER : UPPER;
    return Array.from({length: options.length as number}, (_, i) => { 
        const rand = Math.round(Math.random() * char.length); return char[rand] 
    }).join(''); 
}