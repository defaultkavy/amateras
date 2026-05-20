import { Null } from "./primitive";
import { isInstanceof } from "./type";

export interface trycatch {
    <D, E = any>(callback: () => D): D extends Promise<infer T> ? Promise<Result<T, Error & {cause: E}>> : Result<D, Error & {cause: E}>
}

//@ts-ignore
export const trycatch: trycatch = (callback: any) => {
    try {
        const result = callback();
        if (isInstanceof(result, Promise)) return result.then(res => [res, Null]).catch(err => [Null, new Error(err?.message ?? '', {cause: err})]);
        return [result, Null];
    } catch (err: any) {
        return [Null, new Error(err?.message ?? '', {cause: err})];
    }
}