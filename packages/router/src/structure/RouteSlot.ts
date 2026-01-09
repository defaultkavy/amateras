import { ProxyProto } from "@amateras/core/structure/ProxyProto";
import type { Page } from "./Page";
import { _null } from "@amateras/utils";
import { onserver } from "@amateras/core/env";

export class RouteSlot extends ProxyProto {
    page: Page | null = _null;
    constructor() {
        super();
    }

    render(page: Page) {
        this.clear();
        this.builder = () => $(page);
        page.parent = this;
        if (this.page !== page) this.page?.removeNode();
        this.page = page;
        if (this.node) {
            if (!page.builded) page.build();
            let nodes = this.toDOM();
            this.node.replaceWith(...nodes);
        }
        if (onserver()) {
            if (!page.builded) page.build();
        }
    }
}