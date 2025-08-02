import { chain } from "#lib/chain";
import { isUndefined } from "#lib/native";
import { $HTMLElement } from "#node/$HTMLElement";
import type { RouteData } from "..";
import type { Route } from "./Route";

export class Page<R extends Route<any> = any, Data extends RouteData = any> extends $HTMLElement {
    route: R;
    page: this;
    params: Data['params'];
    query: Data['query'];
    #pageTitle: null | string = null;
    initial = false;
    constructor(route: R, data?: {params: any, query: any}) {
        super('page');
        this.route = route;
        this.page = this;
        this.params = data?.params ?? {};
        this.query = data?.query ?? {};
    }

    pageTitle(): string | null;
    pageTitle(title: string | null): this;
    pageTitle(title?: string | null) {
        return chain(this, arguments, () => this.#pageTitle, title, title => this.#pageTitle = title)
    }
}