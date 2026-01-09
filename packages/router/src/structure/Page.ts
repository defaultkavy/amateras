import { Proto } from "@amateras/core/structure/Proto";
import { RouteSlot } from "./RouteSlot";
import type { AsyncWidget, PageBuilder } from "../types";
import { _instanceof, forEach } from "@amateras/utils";
import type { RouteNode } from "./RouteNode";

export class Page extends Proto {
    slot = new RouteSlot();
    builded = false;
    route: RouteNode;
    declare builder: () => void | AsyncWidget[0]
    constructor(route: RouteNode, builder: PageBuilder, params: Record<string, string>) {
        super(() => builder({params}))
        this.route = route;
    }

    build() {
        if (!this.builded) {
            this.builded = true;
        }
        return super.build();
    }
}

export interface Page {
    get parent(): RouteSlot;
    set parent(proto: Proto);
}