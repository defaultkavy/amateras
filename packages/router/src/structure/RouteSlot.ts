import { onclient } from "@amateras/core";
import { ProxyProto } from "@amateras/core";
import { Utils } from '@amateras/utils';
import { Page } from "./Page";
import { Router } from "./Router";

export class RouteSlot extends ProxyProto {
    page: Page | null = Utils.Null;
    prevPage: Page | null = Utils.Null;
    constructor() {
        super();
    }

    switch(page: Page) {
        if (this.page === page) return;
        this.prevPage = this.page;
        this.clear();
        this.layout = () => $(page);
        this.append(page);
        this.page = page;
        if (!page.builded) page.build();
        page.updateTitle();

        if (!this.dispatch('pageswitch', [this, Router.direction], {bubbles: true})) this.render();
    }

    render() {
        if (onclient()) {
            this.prevPage?.removeNode();
            let nodes = this.toDOM();
            this.node?.replaceWith(...nodes);
        }
    }

    override dispose(): void {
        super.dispose();
        this.page = Utils.Null;
        this.prevPage = Utils.Null;
    }
}