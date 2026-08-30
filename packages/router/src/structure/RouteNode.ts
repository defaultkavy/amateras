import { onclient, symbol_ProtoType } from "@amateras/core";
import { Utils } from '@amateras/utils';
import type { WidgetBuilder, WidgetConstructor } from "@amateras/widget";
import type { AsyncWidget, PageLayout } from "../types";
import { Page } from "./Page";
import { Route } from "./Route";
import type { RouteSlot } from "./RouteSlot";

export class RouteNode extends Route {
    pages = new Map<string, Page>();
    page: Page | null = Utils.Null;
    #layout: WidgetConstructor | WidgetBuilder | AsyncWidget;
    constructor(path: string, layout: WidgetConstructor | AsyncWidget) {
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
            let pageLayout: PageLayout;
            if (Utils.isArray(layout)) {
                let promise = layout[0]()
                if (onclient()) promise.catch(() => location.reload());
                let widget = await promise.then(mod => mod.default);
                pageLayout = ({slot, params}) => $(widget, params, () => $(slot));
            }
            //@ts-ignore
            else if (layout[symbol_ProtoType] === 'Widget') pageLayout = ({slot, params}) => {
                $(this.#layout as WidgetConstructor, params, () => $(slot));
            }
            else pageLayout = ({slot, params}) => $($.widget(layout as WidgetBuilder), params, () => $(slot));
            $.context(slot, () => {
                page = new Page(this, pageLayout, params);
            })
            this.pages.set(path, page);
        }
        this.page = page;
        slot.switch(page);
        return page;
    }
}