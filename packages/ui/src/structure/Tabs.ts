import { ElementProto } from "@amateras/core";
import { _null, is } from "@amateras/utils";

export interface TabsOptions {
    targetId?: string;
}
export class Tabs extends ElementProto {
    targetId: string;
    $container: TabsContainer | null = _null;
    triggers = new Map<string, TabTrigger>();
    constructor({targetId, ...props}: $.Props, layout?: $.Layout<Tabs>) {
        super('tabs', props, layout);
        this.targetId = targetId;
    }

    static {
        $.style(Tabs, 'tabs{display:block;}')
    }

    switch(tabId: string) {
        if (this.targetId === tabId) return;
        this.targetId = tabId;
        this.$container?.renderContent();
    }
}

export interface TabTriggerOptions {
    tabId: string;
}
export class TabTrigger extends ElementProto {
    tabId: string;
    tabs: Tabs | null = _null;
    constructor({tabId, ...props}: $.Props<TabTriggerOptions>, layout?: $.Layout<TabTrigger>) {
        super('tab-trigger', props, layout);
        this.tabId = tabId;
        this.on('click', () => this.tabs?.switch(this.tabId));
    }

    static {
        $.style(Tabs, 'tab-trigger{cursor:pointer;}')
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.tabs = this.findAbove<Tabs>(proto => is(proto, Tabs));
        this.tabs?.triggers.set(this.tabId, this);
        return this;
    }
}

export class TabsContainer extends ElementProto {
    tabs: Tabs | null = null;
    declare __child__: TabContent;
    constructor({...props}: $.Props, layout?: $.Layout<TabsContainer>) {
        super('tab-container', props, layout);
    }

    static {
        $.style(Tabs, 'tab-container{display:block;}')
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.tabs = this.findAbove<Tabs>(proto => is(proto, Tabs));
        if (this.tabs) this.tabs.$container = this;
        return this;
    }

    override toDOM(children = true): HTMLElement[] {
        super.toDOM(false);
        this.renderContent(children);
        return [this.node!]
    }

    override toString(): string {
        return this.parseHTML({children: this.renderContent()?.toString()});
    }

    override mutate(): void {
        this.renderContent();
    }

    getContent(tabId: string) {
        return this.children.find(tabContent => tabContent.tabId === tabId);
    }

    renderContent(children = true) {
        const targetId = this.tabs?.targetId;
        const $targetTabContent = targetId ? this.getContent(targetId) : this.children.at(0);
        if (children && $targetTabContent) {
            this.node?.replaceChildren(...$targetTabContent.toDOM());
            this.tabs?.triggers.forEach($trigger => {
                $trigger.attr('active', $trigger.tabId === $targetTabContent.tabId ? '' : _null);
            })
        }
        return $targetTabContent;
    }
}

export interface TabContentOptions {
    tabId: string;
}
export class TabContent extends ElementProto {
    tabId: string;
    tabs: Tabs | null = null;
    constructor({tabId, ...props}: $.Props<TabContentOptions>, layout?: $.Layout<TabContent>) {
        super('tab-content', props, layout);
        this.tabId = tabId;
    }

    static {
        $.style(Tabs, 'tab-content{display:block;}')
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.tabs = this.findAbove<Tabs>(proto => is(proto, Tabs));
        return this;
    }
}