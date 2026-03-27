import { onclient, Proto } from "@amateras/core";
import { _instanceof, _null, is } from "@amateras/utils";
import type { AsyncWidget, PageLayout } from "../types";
import type { RouteNode } from "./RouteNode";
import { RouteSlot } from "./RouteSlot";

export class Page extends Proto {
    slot = new RouteSlot();
    route: RouteNode;
    title: string | Promise<string> | null = _null;
    declare layout: () => void | AsyncWidget[0];
    constructor(route: RouteNode, layout: PageLayout, params: Record<string, string>) {
        super(() => layout({
            params,
            slot: this.slot
        }));
        this.route = route;
    }

    updateTitle() {
        let title = this.title ?? this.findAbove<Page>(proto => is(proto, Page)?.title)?.title ?? _null;
        let setTitle = (str: string) => {
            if (onclient()) document.title = str;
            this.global.title = str;
        }

        // set title
        if (title) { 
            if (_instanceof(title, Promise)) title.then(t => {
                this.title = t;
                setTitle(t)
            });
            else setTitle(title);
        }
    }
}