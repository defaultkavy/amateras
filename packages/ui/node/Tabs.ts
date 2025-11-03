import { chain } from "@amateras/core/lib/chain";
import { $HTMLElement } from "@amateras/core/node/$HTMLElement";
import type { $Node } from "@amateras/core/node/$Node";
import { _Array_from, _instanceof, forEach, isUndefined } from "@amateras/utils";

const TAB = 'tab';
const TAB_CONTENT = 'tab-content';
const TAB_TRIGGER = 'tab-trigger';
const TAB_CONTAINER = 'tab-container';
const TAB_LIST = 'tab-list';

const DISPLAY_BLOCK = 'display:block'

forEach([
    `${TAB}{${DISPLAY_BLOCK}}`,
    `${TAB_CONTENT}{${DISPLAY_BLOCK}}`,
    `${TAB_LIST}{${DISPLAY_BLOCK}}`,
    `${TAB_CONTAINER}{${DISPLAY_BLOCK}}`,
    `${TAB_TRIGGER}{cursor:pointer}`
], $.style)

export class Tabs extends $HTMLElement {
    #value: null | string = null;
    currentContent: null | TabsContent = null;
    $container: null | TabsContainer = null;
    $list: null | TabsList = null;
    constructor() {
        super(TAB);
    }

    value(): string | null;
    value(value: string | undefined): this;
    value(value?: string) {
        return chain(this, arguments, () => this.#value, value, value => {
            this.#value = value;
            this.$container?.content(this.$container.contentMap.get(value));
            this.$list?.check();
        })
    }

    mounted($parent: $Node): void {
        this.$list?.check();
    }
}

export class TabsContainer extends $HTMLElement {
    $tabs?: Tabs;
    contentMap = new Map<string, TabsContent>();
    constructor($tabs?: Tabs) {
        super(TAB_CONTAINER);
        this.$tabs = $tabs;
    }

    mounted($parent: $Node) {
        if (_instanceof($parent, Tabs)) this.$tabs = $parent;
        if (this.$tabs) {
            this.$tabs.$container = this;
            this.content(this.contentMap.get(this.$tabs.value() ?? ''))
        }
        return this;
    }
}

export class TabsContent extends $HTMLElement {
    #value: string;
    $container: null | TabsContainer = null;
    constructor(value: string) {
        super(TAB_CONTENT);
        this.#value = value
    }

    value(): string;
    value(value: string): this;
    value(value?: string) {
        return chain(this, arguments, () => this.#value, value, value => {
            this.#value = value; 
            this.$container?.contentMap.set(value, this).delete(this.#value ?? '')
        })
    }

    mounted($parent: $Node) {
        if (!_instanceof($parent, TabsContainer)) return this;
        if ($parent && this.#value) {
            this.$container = $parent;
            $parent.contentMap.set(this.#value, this);
        }
        return this;
    }
}

export class TabsList extends $HTMLElement {
    $tabs?: null | Tabs = null;
    triggers = new Map<string, TabsTrigger>();
    constructor($tabs?: Tabs) {
        super(TAB_LIST);
        this.$tabs = $tabs;
        this.on('click', _ => this.check())
    }

    check() {
        this.triggers.forEach($trigger => $trigger.attr({selected: $trigger.value() === this.$tabs?.value() ? '' : null}))
        return this;
    }

    mounted($parent: $Node): this {
        if (_instanceof($parent, Tabs)) this.$tabs = $parent, $parent.$list = this;
        if (this.$tabs) forEach(_Array_from(this.childNodes), child => $(child).is(TabsTrigger)?.use($child => {
            this.triggers.set($child.value(), $child);
            $child.$tabs = this.$tabs;
        }));
        return this;
    }
}

export class TabsTrigger extends $HTMLElement {
    #value: string;
    $tabs?: null | Tabs = null;
    constructor(value: string) {
        super(TAB_TRIGGER);
        this.#value = value;
        this.on('click', _ => this.$tabs?.value(this.#value ?? undefined))
    }

    value(): string;
    value(value: string): this;
    value(value?: string) {
        return chain(this, arguments, () => this.#value, value, value => this.#value = value)
    }
}