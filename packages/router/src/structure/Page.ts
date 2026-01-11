import { Proto } from "@amateras/core/structure/Proto";
import { _null } from "@amateras/utils";
import type { AsyncWidget, PageBuilder } from "../types";
import type { RouteNode } from "./RouteNode";
import { RouteSlot } from "./RouteSlot";

export class Page extends Proto {
    slot = new RouteSlot();
    builded = false;
    route: RouteNode;
    title: string | null = _null;
    declare builder: () => void | AsyncWidget[0];
    constructor(route: RouteNode, builder: PageBuilder, params: Record<string, string>) {
        super(() => builder({
            params,
            slot: this.slot
        }));
        this.route = route;
    }

    build() {
        if (!this.builded) this.builded = true;
        return super.build();
    }
}

export interface Page {
    get parent(): RouteSlot;
    set parent(proto: Proto);
}