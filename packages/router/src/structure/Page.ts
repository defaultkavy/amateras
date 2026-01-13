import { Proto } from "@amateras/core/structure/Proto";
import { _null } from "@amateras/utils";
import type { AsyncWidget, PageLayout } from "../types";
import type { RouteNode } from "./RouteNode";
import { RouteSlot } from "./RouteSlot";

export class Page extends Proto {
    slot = new RouteSlot();
    builded = false;
    route: RouteNode;
    title: string | null = _null;
    declare layout: () => void | AsyncWidget[0];
    constructor(route: RouteNode, layout: PageLayout, params: Record<string, string>) {
        super(() => layout({
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