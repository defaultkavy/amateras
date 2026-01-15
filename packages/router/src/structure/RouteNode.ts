import { symbol_ProtoType } from "@amateras/core/lib/symbols";
import { _null, isArray } from "@amateras/utils";
import type { Widget } from "@amateras/widget/structure/Widget";
import type { AsyncWidget, PageLayout } from "../types";
import { Page } from "./Page";
import { Route } from "./Route";
import type { RouteSlot } from "./RouteSlot";

export class RouteNode extends Route {
    pages = new Map<string, Page>();
    page: Page | null = _null;
    #layout: Widget | PageLayout | AsyncWidget;
    constructor(path: string, layout: Widget | PageLayout | AsyncWidget) {
        super(path);
        this.#layout = layout;
    }

    async resolve(path: string, slot: RouteSlot, params: Record<string, string>): Promise<boolean> {
        let result = this.routing(path);
        if (!result) return false;
        let [passPath, selfParams] = result;
        params = { ...params, ...selfParams };
        let page = await this.usePage(passPath, params, slot);
        let restPath = path.replace(passPath, '');
        for (let [_name, route] of this.routes) {
            let result = await route.resolve(restPath || '/', page.slot, params)
            if (result) return true;
        }
        if (!restPath) return true;
        return false;
    }

    async usePage(path: string, params: Record<string, string>, slot: RouteSlot) {
        let page = this.pages.get(path);
        if (!page) {
            let layout = this.#layout;
            let _layout;
            if (isArray(layout)) {
                let widget = await layout[0]().then(mod => mod.default);
                _layout = () => $(widget, params, () => $(page!.slot));
            } else {
                //@ts-ignore
                _layout = this.#layout[symbol_ProtoType] === 'Widget' // is widget constructor
                ?   () => $(this.#layout as Widget, params, () => $(page!.slot)) 
                :   this.#layout as PageLayout;
            }
            page = new Page(this, _layout, params);
            this.pages.set(path, page);
        }
        this.page = page;
        slot.render(page);
        return page;
    }
}