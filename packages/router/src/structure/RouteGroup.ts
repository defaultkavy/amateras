import { Route } from "./Route";
import type { RouteSlot } from "./RouteSlot";

export class RouteGroup extends Route {
    constructor(path: string) {
        super(path);
    }
    
    async resolve(path: string, slot: RouteSlot, params: Record<string, string>): Promise<Route[] | void> {
        let result = this.routing(path);
        if (!result) return;
        let [, passPath, selfParams] = result;

        params = {...params, ...selfParams};
        let restPath = path.replace(passPath, '');
        // handler '/' at path end

        for (let [_name, route] of this.routes) {
            let result = await route.resolve(restPath || '/', slot, params)
            if (result) return [this, ...result];
        }
        return [this];
    }
}