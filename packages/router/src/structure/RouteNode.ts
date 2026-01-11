import { symbol_ProtoType } from "@amateras/core/lib/symbols";
import { _null, isArray } from "@amateras/utils";
import type { Widget } from "@amateras/widget/structure/Widget";
import type { AsyncWidget, PageBuilder } from "../types";
import { Page } from "./Page";
import { Route } from "./Route";
import type { RouteSlot } from "./RouteSlot";
import type { Router } from "./Router";

export class RouteNode extends Route {
    pages = new Map<string, Page>();
    page: Page | null = _null;
    layout: Widget | PageBuilder | AsyncWidget;
    constructor(router: Router, path: string, layout: Widget | PageBuilder | AsyncWidget) {
        super(router, path);
        this.layout = layout;
    }

    async resolve(path: string, slot: RouteSlot, params: Record<string, string>): Promise<boolean> {
        let cachedPage = this.pages.get(path);
        if (cachedPage) {
            slot.render(cachedPage);
            return true;
        };

        let result = this.routing(path);
        if (!result) return false;
        let [passPath, selfParams] = result;
        params = { ...params, ...selfParams };
        let page = await this.usePage(passPath, params, slot);
        let restPath = passPath === '/' ? path : path.replace(passPath, '');
        if (restPath) {
            for (let [_name, route] of this.routes) {
                let result = await route.resolve(restPath, page.slot, params)
                if (result) return true;
            }
            return false;
        }
        return true;
    }

    async usePage(path: string, params: Record<string, string>, slot: RouteSlot) {
        let page = this.pages.get(path);
        if (!page) {
            let layout = this.layout;
            let builder;
            if (isArray(layout)) {
                let widget = await layout[0]().then(mod => mod.default);
                builder = () => $(widget, params);
            } else {
                //@ts-ignore
                builder = this.layout[symbol_ProtoType] === 'Widget' // is widget constructor
                ?   () => $(this.layout as Widget, params) 
                :   this.layout as PageBuilder;
            }
            page = new Page(this, builder, params);
            this.pages.set(path, page);
        }
        this.page = page;
        slot.render(page);
        return page;
    }
}