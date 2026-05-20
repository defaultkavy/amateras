import { isAsyncFunction } from "./type";

interface forEach {
    <T>(arr: Array<T> | null | undefined, fn: (value: T, index: number, array: Array<T>) => Promise<void>): Promise<void>;
    <T>(arr: Array<T> | null | undefined, fn: (value: T, index: number, array: Array<T>) => void): void;
    <T>(set: Set<T> | null | undefined, fn: (value: T, index: number, set: Set<T>) => Promise<void>): void;
    <T>(set: Set<T> | null | undefined, fn: (value: T, index: number, set: Set<T>) => void): void;
    <T extends WeakKey>(set: WeakSet<T> | null | undefined, fn: (value: T, index: number, set: WeakSet<T>) => Promise<void>): void;
    <T extends WeakKey>(set: WeakSet<T> | null | undefined, fn: (value: T, index: number, set: WeakSet<T>) => void): void;
    <T>(list: Array<T> |  Set<T> | null | undefined, fn: (value: T, index: number, set: Array<T> | Set<T>) => Promise<void>): void;
    <T>(list: Array<T> | Set<T> | null | undefined, fn: (value: T, index: number, set: Array<T> | Set<T>) => void): void;
    <K, V>(map: Map<K, V> | null | undefined, fn: (value: [K, V], index: number, map: Map<K, V>) => Promise<void>): void;
    <K, V>(map: Map<K, V> | null | undefined, fn: (value: [K, V], index: number, map: Map<K, V>) => void): void;
    <N extends Node>(set: NodeListOf<N> | null | undefined, fn: (value: N, index: number, parent: NodeListOf<N>) => Promise<void>): void;
    <N extends Node>(set: NodeListOf<N> | null | undefined, fn: (value: N, index: number, parent: NodeListOf<N>) => void): void;
    <K>(iterator: MapIterator<K>, fn: (value: K, index: number, arr: Array<K>) => Promise<void>): void;
    <K>(iterator: MapIterator<K>, fn: (value: K, index: number, arr: Array<K>) => void): void;
}
export const forEach: forEach = async (arr: any, fn: any) => {
    if (!arr) return;
    let i = 0;
    let asyncHandle = async () => { for (let item of arr) { await fn(item, i, arr); i++; } };
    let handle = () => { for (let item of arr) { fn(item, i, arr); i++; } };
    return isAsyncFunction(fn) ? asyncHandle() : handle();
};