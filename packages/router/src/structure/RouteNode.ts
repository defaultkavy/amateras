import { onclient, Proto, symbol_ProtoType } from "@amateras/core";
import { _null, isArray } from "@amateras/utils";
import type { WidgetConstructor } from "@amateras/widget";
import type { AsyncWidget, PageLayout } from "../types";
import { Page } from "./Page";
import { Route } from "./Route";
import type { RouteSlot } from "./RouteSlot";

export class RouteNode extends Route {
    pages = new Map<string, Page>();
    page: Page | null = _null;
    #layout: WidgetConstructor | PageLayout | AsyncWidget;
    constructor(path: string, layout: WidgetConstructor | PageLayout | AsyncWidget) {
        super(path);
        this.#layout = layout;
    }

    async resolve(path: string, slot: RouteSlot, params: Record<string, string>): Promise<Route[] | void> {
        let result = this.routing(path);
        if (!result) return;
        let [pathId, passPath, selfParams] = result;
        params = { ...params, ...selfParams };
        let page = await this.usePage(pathId, params, slot);
        let restPath = path.replace(passPath, '');
        for (let [_name, route] of this.routes) {
            let result = await route.resolve(restPath || '/', page.slot, params)
            if (result) return [this, ...result];
        }
        if (!restPath) return [this];
        return;
    }

    async usePage(path: string, params: Record<string, string>, slot: RouteSlot) {
        let page = this.pages.get(path)!;
        if (!page) {
            let layout = this.#layout;
            let _layout;
            if (isArray(layout)) {
                let promise = layout[0]()
                if (onclient()) promise.catch(() => location.reload());
                let widget = await promise.then(mod => mod.default);
                _layout = () => $(widget, params, () => $(page!.slot));
            } else {
                //@ts-ignore
                _layout = this.#layout[symbol_ProtoType] === 'Widget' // is widget constructor
                ?   () => $(this.#layout as WidgetConstructor, params, () => $(page!.slot)) 
                :   this.#layout as PageLayout;
            }
            $.context(Proto, slot, () => {
                page = new Page(this, _layout, params);
            })
            this.pages.set(path, page);
        }
        // let prevPage = this.page;
        this.page = page;
        slot.switch(page);
        // if (prevPage !== page) prevPage?.dispose();
        return page;
    }
}