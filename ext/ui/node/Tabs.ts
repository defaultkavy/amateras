import { _Array_from, _instanceof, forEach, isUndefined } from "amateras/lib/native";
import { $HTMLElement } from "amateras/node/$HTMLElement";
import type { $Node } from "amateras/node/$Node";

$.style('tabs,tabs-container,tabs-list,tabs-content{display: block}')

export class Tabs extends $HTMLElement {
    #value: null | string = null;
    currentContent: null | TabsContent = null;
    $container: null | TabsContainer = null;
    $list: null | TabsList = null;
    constructor() {
        super('tabs');
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
}

export class TabsContainer extends $HTMLElement {
    $tabs?: Tabs;
    contentMap = new Map<string, TabsContent>();
    constructor($tabs?: Tabs) {
        super('tabs-container');
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
        super('tabs-content');
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
        super('tabs-list');
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
        super('tabs-trigger');
        this.#value = value;
        this.on('click', _ => this.$tabs?.value(this.#value ?? undefined))
    }

    value(): string;
    value(value: string): this;
    value(value?: string) {
        return chain(this, arguments, () => this.#value, value, value => this.#value = value)
    }
}

function chain<T, R, V>(_this: T, args: IArguments, get: () => R, value: V, set: (value: Exclude<V, undefined>) => any) {
    return !args.length ? get() : isUndefined(value) ? _this : (set(value as any), _this);
}