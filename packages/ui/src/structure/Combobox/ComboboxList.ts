import { toCSS } from "#lib/toCSS";
import { Icon } from "#structure/Icon";
import { ElementProto } from "@amateras/core";
import { _null, _instanceof, forEach, isUndefined } from "@amateras/utils";
import { check_svg } from "../../icon/check.svg";
import { Combobox } from "./Combobox";
import { item_css } from "#lib/combobox_style";


export class ComboboxList extends ElementProto {
    $combobox: Combobox | null = _null;
    $focusedItem: ComboboxItem | ComboboxCreateItem | null = _null;
    $createItem: ComboboxCreateItem | null = _null;
    declare __child__: ComboboxItem | ComboboxCreateItem;
    constructor(props: $.Props, layout?: $.Layout<ComboboxList>) {
        super('combobox-list', props, layout);
    }
    
    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$combobox = this.findAbove<Combobox>(proto => _instanceof(proto, Combobox));
        if (this.$combobox) this.$combobox.$list = this;
        return this;
    }

    filter(input: string) {
        if (!this.$combobox) return;
        const items: ComboboxItem[] = [];
        if (this.$createItem) this.$createItem.visible = !!input && !this.$combobox.itemMap.has(input);
        forEach(this.$combobox.itemMap, ([_, $item]) => {
            $item.visible = false;
            if ($item.text.toLowerCase().includes(input.toLowerCase())) {
                $item.visible = true;
                items.push($item);
            }
        })
        if (this.$combobox?.$content?.$empty) this.$combobox.$content.$empty.visible = !this.$createItem?.visible && !items.length;
        this.$combobox.$content?.toDOM();
    }

    switch(dir: 'up' | 'down') {
        const $focusedItem = this.$focusedItem;
        const items = this.children;
        const currentPosition = $focusedItem ? items.indexOf($focusedItem) : dir === 'up' ? 0 : -1;
        let targetIndex = dir === 'up' ? currentPosition - 1 : currentPosition + 1;
        if (targetIndex < 0 || targetIndex >= items.length) targetIndex = dir === 'up' ? -1 : 0;
        this.focus(targetIndex);
    }

    focus(index: number) {
        let $target = this.children.at(index);
        this.$focusedItem?.blur();
        $target?.focus();
    }

    focusFirstItem() {
        if (this.$createItem?.visible && this.children[1]) this.focus(1);
        else this.focus(0)
    }

    override mutate(): void {
        // super.mutate();
        // const items = this.findBelowAll<ComboboxItem>(proto => _instanceof(proto, ComboboxItem));
        // console.debug(items)
        // this.$combobox?.itemMap.clear();
        // forEach(items, $item => {
        //     this.$combobox?.itemMap.set($item.value(), $item);
        // })
    }
}

export interface ComboboxItemProps {
    value: OrSignal<any>;
    label: OrSignal<string>;
    selected?: OrSignal<boolean>;
}

export class ComboboxItem extends ElementProto {
    static tagname = 'combobox-item'
    $combobox: Combobox | null = _null;
    $list: ComboboxList | null = _null;
    #value: any = _null;
    #label: string = '';
    #selected = false;
    constructor(props: $.Props<ComboboxItemProps>, layout?: $.Layout<ComboboxItem>) {
        super('combobox-item', props, () => {
            if (layout) layout(this);
            else $([ this.#label ])
            $(Icon, {ui: 'combobox-item-check', svg: check_svg})
        });

        this.on('mousedown', e => e.preventDefault())

        this.on('click', () => {
            this.$combobox?.select(this.#value, !this.selected())
        })
    }

    static {
        $.style(this, toCSS(this.tagname, {
            ...item_css,

            'icon[ui="combobox-item-check"]': {
                visibility: 'hidden',
                marginInlineStart: 'auto'
            },

            '&[selected] icon[ui="combobox-item-check"]': {
                visibility: 'visible'
            }
        }))
    }
    
    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$combobox = this.findAbove<Combobox>(proto => _instanceof(proto, Combobox));
        this.$list = this.findAbove<ComboboxList>(proto => _instanceof(proto, ComboboxList));
        this.$combobox?.itemMap.set(this.#value, this);
        return this;
    }

    override props({ value, label, selected, ...props }: $.Props<ComboboxItemProps>): void {
        super.props(props);
        this.value(value);
        this.label(label);
        this.selected(selected);
    }

    value(): any;
    value(val?: OrSignal<any>): void;
    value(val?: OrSignal<any>) {
        if (!arguments.length) return this.#value;
        if (isUndefined(val)) return;
        $.resolve(val, val => {
            this.$combobox?.itemMap.delete(this.#value);
            this.$combobox?.itemMap.set(val, this);
            this.#value = val;
        })
    }

    label(): string;
    label(val?: OrSignal<string>): void;
    label(val?: OrSignal<string>) {
        if (!arguments.length) return this.#label;
        if (isUndefined(val)) return;
        $.resolve(val, val => {
            this.#label = val;
        })
    }

    selected(): boolean;
    selected(val?: OrSignal<boolean>): void;
    selected(val?: OrSignal<boolean>) {
        if (!arguments.length) return this.#selected;
        if (isUndefined(val)) return;
        $.resolve(val, val => {
            this.#selected = val;
            this.attr('selected', val ? '' : null)
        })
    }

    focus() {
        this.attr('focus', '');
        if (this.$list) this.$list.$focusedItem = this;
    }

    blur() {
        this.attr('focus', _null)
        if (this.$list) this.$list.$focusedItem = null;
    }
}

export class ComboboxCreateItem extends ElementProto {
    static tagname = 'combobox-create-item'
    $combobox: Combobox | null = _null;
    $list: ComboboxList | null = _null;
    constructor(props: $.Props, layout?: $.Layout<ComboboxCreateItem>) {
        super('combobox-create-item', props, layout);

        this.on('mousedown', e => e.preventDefault())

        this.on('click', () => {
        })
    }

    static {
        $.style(this, toCSS(this.tagname, {
            ...item_css
        }))
    }
    
    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$combobox = this.findAbove<Combobox>(proto => _instanceof(proto, Combobox));
        this.$list = this.findAbove<ComboboxList>(proto => _instanceof(proto, ComboboxList));
        if (this.$list) this.$list.$createItem = this;
        return this;
    }

    focus() {
        this.attr('focus', '');
        if (this.$list) this.$list.$focusedItem = this;
    }

    blur() {
        this.attr('focus', _null)
        if (this.$list) this.$list.$focusedItem = null;
    }
}