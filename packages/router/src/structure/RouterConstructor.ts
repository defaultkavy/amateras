import { symbol_ProtoType } from "@amateras/core";
import { RouterProto } from "./Router";

export type RouterHandle = ($$: RouterProto) => void;

export interface Router {
    new(): RouterProto;
}

export const RouterConstructor = (handle: RouterHandle) => {
    return class extends RouterProto {
        static override [symbol_ProtoType] = 'Router';
        constructor() {
            super();
            handle(this);
        }
    }
}