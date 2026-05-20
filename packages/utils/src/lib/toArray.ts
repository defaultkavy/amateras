import { isInstanceof } from "./type";

export const toArray = <T>(item: OrArray<T>): T[] => isInstanceof(item, Array) ? item : [item];