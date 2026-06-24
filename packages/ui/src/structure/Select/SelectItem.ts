import { ElementProto } from "@amateras/core";
import { Utils } from '@amateras/utils';
import { Select } from "./Select";
import { toUICSS } from "#lib/toCSS";
import { SelectContent } from "./SelectContent";
import { item_css } from "../../style/combobox_style";

export interface SelectItemProps {
    value: OrSignal<any>;
    disabled?: OrSignal<boolean>;
}

export class SelectItem extends ElementProto {
    static tagname = 'select-item'
    $select: Select | null = Utils.Null;
    $content: SelectContent | null = Utils.Null;
    #value: any = Utils.Null;
    constructor(props: $.Props<SelectItemProps>, layout?: $.Layout<Select>) {
        super(SelectItem.tagname, {tabindex: 0, ...props}, layout);
        this.on('mousedown', e => e.preventDefault())
        this.on('click', () => {
            if (this.disabled()) return;
            this.$select?.close();
            this.select();
        })
    }

    static {
        $.style(this, toUICSS(this.tagname, item_css))
    }

    override props({ value, disabled, ...props }: $.Props<SelectItemProps>): void {
        super.props(props);
        this.value(value);
        this.disabled(disabled)
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$select = this.findAbove<Select>(proto => Utils.isInstanceof(proto, Select));
        this.$content = this.findAbove<SelectContent>(proto => Utils.isInstanceof(proto, SelectContent));
        if (this.$select && this.$select.value() === this.#value) this.$select.selected = this;
        this.$select?.itemMap.set(this.#value, this);
        return this;
    }

    value(): any;
    value(val: OrSignal<any>): void;
    value(val?: OrSignal<any>) {
        if (!arguments.length) return this.#value;
        if (Utils.isUndefined(val)) return;
        $.resolve(val, val => {
            this.#value = val;
        })
    }

    disabled(): boolean;
    disabled(val?: OrSignal<boolean>): void;
    disabled(val?: OrSignal<boolean>) {
        if (!arguments.length) return this.hasAttr('disabled');
        if (Utils.isUndefined(val)) return;
        $.resolve(val, val => {
            this.attr('disabled', val ? '' : Utils.Null);
        })
    }

    select() {
        if (!this.$select) return;
        this.$select.value(this.value())
    }

    focus(scroll = true) {
        this.$content?.$focusedItem?.blur();
        this.attr('focus', '');
        const parentNode = this.$content?.node;
        if (parentNode && parentNode.scrollHeight > parentNode.clientHeight) {
            this.node?.scrollIntoView({block: 'nearest'});
        }
        if (this.$content) this.$content.$focusedItem = this;
    }

    blur() {
        this.attr('focus', Utils.Null)
        if (this.$content) this.$content.$focusedItem = null;
    }
}