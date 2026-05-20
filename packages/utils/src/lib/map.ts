import { arrayFrom } from "./array";
import { Undefined } from "./primitive";

interface map {
    <A extends Array<any> | null | undefined, T extends A extends Array<infer I> ? I : never, R>(arr: A, fn: (value: T, index: number, array: Array<T>) => R): A extends Nullish ? undefined | R[] : R[];
    <S extends Set<any> | null | undefined, T extends S extends Set<infer I> ? I : never, R>(set: S, fn: (value: T, index: number, set: Set<T>) => R): S extends Nullish ? undefined | R[] : R[];
    <A extends Array<any> | Set<any> | null | undefined, T extends A extends Array<infer I> | Set<infer I> ? I : never, R>(list: A, fn: (value: T, index: number, set: Array<T> | Set<T>) => R): A extends Nullish ? undefined | R[] : R[];
    <M extends Map<any, any> | null | undefined, T extends M extends Map<infer K, infer V> ? [K, V] : never, R>(map: M, fn: (value: T, index: number, map: Map<T[0], T[1]>) => R): M extends Nullish ? undefined | R[] : R[];
    <L extends NodeListOf<any> | null | undefined, N extends L extends NodeListOf<infer T> ? T : never, R>(list: L, fn: (value: N, index: number, parent: NodeListOf<N>) => R): L extends Nullish ? undefined | R[] : R[];
}
export const map: map = (arr: any, fn: any) => arr ? arrayFrom(arr).map(fn) as any : Undefined;