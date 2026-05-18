import { toUICSS } from "#lib/toCSS";
import { ElementProto, onclient } from "@amateras/core";
import { Input } from "./Input";
import { input_css } from "../style/input_style";
import { content_css } from "../style/content_style";
import { item_css } from "../style/combobox_style";
import { float, type FloatDisconnect } from "#lib/float";
import { _instanceof, _null } from "@amateras/utils";

export interface SearchbarProps {
    autoclose?: OrSignal<'' | null>;
}

export class Searchbar extends ElementProto {
    static tagname = 'searchbar';
    private disconnect: FloatDisconnect | null = _null;
    $content: SearchbarContent | null = _null;
    $list: SearchbarList | null = _null;
    $input: SearchbarInput | null = _null;
    constructor(props: $.Props<SearchbarProps>, layout?: $.Layout<Searchbar>) {
        super('searchbar', props, layout);
    }

    static {
        $.style(this, toUICSS(this.tagname, {

        }))
    }
        
    open() {
        if (this.hasAttr('opened')) return;
        this.attr('opened', '');
        if (onclient() && this.$content) {
            this.disconnect = float(this.$input?.node!, this.$content.node!);
            document.body.append(...this.$content.toDOM());
        }
    }

    close() {
        this.attr('opened', _null);
        if (!onclient()) return;
        this.$content?.removeNode();
        this.disconnect?.();
        this.disconnect = _null;
    }


    override toDOM(children = true): HTMLElement[] {
        super.toDOM(false);
        if (children && this.$input) {
            this.node?.append(...this.$input.toDOM());
            this.$content?.toDOM();
        }
        return [this.node!]
    }
}

export class SearchbarInput extends Input {
    $searchbar: Searchbar | null = _null;
    constructor(props: $.Props<{}, HTMLInputElement>, layout?: $.Layout<SearchbarInput>) {
        super({ ui: 'searchbar-input', ...props }, layout as $.Layout<Input>);

        this.on('focus', e => this.$searchbar?.$list?.visibleChildren.length && this.$searchbar.open())
        this.on('blur', e => this.$searchbar?.close())

        this.on('keydown', e => {
            switch (e.key) {
                case 'ArrowDown': {
                    e.preventDefault();
                    this.$searchbar?.$list?.switch('down');
                    return;
                }
                case 'ArrowUp': {
                    e.preventDefault();
                    this.$searchbar?.$list?.switch('up')
                    return;
                }
            }
        })

        this.on('keyup', e => {
            switch (e.key) {
                case 'Escape': {
                    e.preventDefault();
                    this.$searchbar?.close();
                    this.$searchbar?.$input?.node?.blur();
                    return;
                }
                case 'Enter': {
                    e.preventDefault();
                    this.$searchbar?.$list?.$focusedItem?.select();
                    return;
                }
            }
        })
    }

    static {
        $.style(this, toUICSS(`input[ui="searchbar-input"]`, {
            ...input_css,
            width: '100%'
        }))
    }
    
    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$searchbar = this.findAbove<Searchbar>(proto => _instanceof(proto, Searchbar));
        if (this.$searchbar) this.$searchbar.$input = this;
        return this;
    }
}

export class SearchbarContent extends ElementProto {
    static tagname = 'searchbar-content';
    $searchbar: Searchbar | null = _null;
    constructor(props: $.Props, layout?: $.Layout<SearchbarContent>) {
        super('searchbar-content', props, layout);
        this.listen('mutate', () => {
            if (this.$searchbar?.$list?.visibleChildren.length) this.$searchbar.open();
            else this.$searchbar?.close();
        })
    }

    static {
        $.style(this, toUICSS(this.tagname, content_css))
    }
    
    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$searchbar = this.findAbove<Searchbar>(proto => _instanceof(proto, Searchbar));
        if (this.$searchbar) this.$searchbar.$content = this;
        return this;
    }
}

export class SearchbarList extends ElementProto {
    $searchbar: Searchbar | null = _null;
    $focusedItem: SearchbarItem | null = _null;
    declare __child__: SearchbarItem;
    constructor(props: $.Props, layout?: $.Layout<SearchbarList>) {
        super('combobox-list', props, layout);
    }
    
    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$searchbar = this.findAbove<Searchbar>(proto => _instanceof(proto, Searchbar));
        if (this.$searchbar) this.$searchbar.$list = this;
        return this;
    }

    switch(dir: 'up' | 'down') {
        const $focusedItem = this.$focusedItem;
        const items = this.visibleChildren;
        const currentPosition = $focusedItem ? items.indexOf($focusedItem) : dir === 'up' ? 0 : -1;
        let targetIndex = dir === 'up' ? currentPosition - 1 : currentPosition + 1;
        if (targetIndex < 0 || targetIndex >= items.length) targetIndex = dir === 'up' ? -1 : 0;
        this.focus(targetIndex);
    }

    focus(index: number) {
        let $target = this.visibleChildren.at(index);
        this.$focusedItem?.blur();
        $target?.focus();
    }
}

export class SearchbarItem extends ElementProto {
    static tagname = 'searchbar-item';
    $list: SearchbarList | null = _null;
    constructor(props: $.Props, layout?: $.Layout<SearchbarItem>) {
        super('searchbar-item', props, layout)
        this.on('click', () => this.select())
        this.on('mousedown', e => e.preventDefault())
    }

    static {
        $.style(this, toUICSS(this.tagname, item_css))
    }
        
    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$list = this.findAbove<SearchbarList>(proto => _instanceof(proto, SearchbarList));
        return this;
    }

    focus() {
        this.attr('focus', '');
        this.node?.scrollIntoView({block: 'nearest'});
        if (this.$list) this.$list.$focusedItem = this;
    }

    blur() {
        this.attr('focus', _null)
        if (this.$list) this.$list.$focusedItem = null;
    }

    select() {
        this.dispatch('searchbar_item_select', []);
        if (this.$list?.$searchbar?.hasAttr('autoclose')) this.$list.$searchbar.close();
    }
}

declare global {
    export namespace $ {
        export interface ProtoEventMap<P> {
            searchbar_item_select: [any];
        }
    }
}