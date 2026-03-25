import { onclient } from "@amateras/core";
import { ProxyProto } from "@amateras/core";
import { _null } from "@amateras/utils";
import { Page } from "./Page";

export class RouteSlot extends ProxyProto {
    page: Page | null = _null;
    constructor() {
        super();
    }

    switch(page: Page) {
        if (this.page === page) return;
        this.clear();
        this.layout = () => $(page);
        this.appendProto(page);
        if (this.page !== page) this.page?.removeNode();
        this.page = page;
        if (!page.builded) page.build();
        page.updateTitle();
        
        if (onclient()) {
            let nodes = this.toDOM();
            this.node?.replaceWith(...nodes);
        }
    }
}