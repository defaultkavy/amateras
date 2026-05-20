import { isInstanceof } from "./type";

const _URL = URL;
export const toURL = (path: string | URL, base = globalThis.origin ?? 'http://localhost') => {
    if (isInstanceof(path, _URL)) return path;
    return new URL(path, base)
}