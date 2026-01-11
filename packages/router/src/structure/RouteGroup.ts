import { _Array_from } from "@amateras/utils";
import { Route } from "./Route";
import type { RouteSlot } from "./RouteSlot";
import type { Router } from "./Router";

export class RouteGroup extends Route {
    constructor(router: Router, path: string) {
        super(router, path);
    }
    
    async resolve(path: string, slot: RouteSlot, params: Record<string, string>): Promise<boolean> {
        let result = this.routing(path);
        if (!result) return false;
        let [passPath, selfParams] = result;

        params = {...params, ...selfParams};
        let restPath = path.replace(passPath, '');
        // handler '/' at path end
        return !!_Array_from(this.routes).find(route => route[1].resolve(restPath || '/', slot, params));
    }
}