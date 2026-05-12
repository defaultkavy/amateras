import { symbol_ProtoType } from "@amateras/core";
import { Router } from "./Router";

export type RouterHandle = ($$: Router) => void;
export interface RouterConstructor extends Constructor<Router> {
    [symbol_ProtoType]: 'Router';
}

export const RouterConstructor = (handle: RouterHandle) => {
    return class extends Router {
        static override [symbol_ProtoType] = 'Router' as any;
        constructor() {
            super();
            handle(this);
        }
    }
}