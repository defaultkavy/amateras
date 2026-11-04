import { randstr, type RandomIdOptions } from './randstr';
const map = new Map<string, Set<string>>()
export const uid = (key: string, options?: RandomIdOptions): string => {
    const set = map.get(key) ?? new Set();
    const id = randstr(options);
    if (set.has(id)) return uid(key, options);
    // options?.proto?.listen('dispose', () => this.uidmap.get(key)?.delete(id))
    return id;
}