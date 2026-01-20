import { onserver } from "@amateras/core/env";
import { ProxyProto } from "@amateras/core/structure/ProxyProto";
import { _null } from "@amateras/utils";
import type { Page } from "./Page";

export class RouteSlot extends ProxyProto {
    page: Page | null = _null;
    constructor() {
        super();
    }

    render(page: Page) {
        if (this.page === page) return;
        this.clear();
        this.layout = () => $(page);
        page.parent = this;
        if (this.page !== page) this.page?.removeNode();
        this.page = page;
        if (this.node) {
            if (!page.builded) page.build();
            let nodes = this.toDOM();
            this.node.replaceWith(...nodes);
            // set title from page
            if (page.title) {
                document.title = page.title;
                page.global.title = page.title;
            }
        }
        if (onserver()) {
            if (!page.builded) page.build();
            page.global.title = page.title;
        }
    }
}