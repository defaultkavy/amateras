import { _instanceof, _Object_assign } from "./native";

export const toArray = <T>(item: OrArray<T>): T[] => _instanceof(item, Array) ? item : [item];

declare module '#core' {
    export namespace $ {
        export function toArray<T>(item: OrArray<T>): T[];
    }
}