import type { AsyncWidget, PageBuilder } from "../types";
import { Page } from "./Page";
import { Route } from "./Route";
import { _Array_from, _null, isArray, isUndefined } from "@amateras/utils";
import type { RouteSlot } from "./RouteSlot";
import type { Widget } from "@amateras/widget/structure/Widget";
import { symbol_ProtoType } from "@amateras/core/lib/symbols";

export class RouteNode extends Route {
    pages = new Map<string, Page>();
    page: Page | null = _null;
    layout: Widget | PageBuilder | AsyncWidget;
    constructor(path: string, layout: Widget | PageBuilder | AsyncWidget) {
        super(path);
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
        if (restPath) return !!_Array_from(this.routes).find(route => route[1].resolve(restPath, page.slot, params));
        return true;
    }

    async usePage(path: string, params: Record<string, string>, slot: RouteSlot) {
        let layout = this.layout;
        let builder
        if (isArray(layout)) {
            let widget = await layout[0]().then(mod => mod.default);
            builder = () => $(widget, params);
        } else {
            //@ts-ignore
            builder = this.layout[symbol_ProtoType] === 'Widget' // is widget constructor
            ?   () => $(this.layout as Widget, params) 
            :   this.layout as PageBuilder;
        }
        let page = new Page(this, builder, params);
        this.page = page;
        this.pages.set(path, page);
        slot.render(page);
        return page;
    }
}