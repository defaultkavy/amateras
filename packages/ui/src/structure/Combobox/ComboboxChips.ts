import { toCSS } from "#lib/toCSS";
import { Icon } from "#structure/Icon";
import { ProxyProto, ElementProto } from "@amateras/core";
import { _null, _instanceof, isUndefined } from "@amateras/utils";
import { x_svg } from "../../icon/x.svg";
import { Combobox } from "./Combobox";
import type { ComboboxItemProps } from "./ComboboxList";


export class ComboboxChips extends ProxyProto {
    static tagname = 'combobox-chips';
    $combobox: Combobox | null = _null;
    chipMap = new Map<any, ComboboxChip>();
    $focusedChip: ComboboxChip | null = _null;
    declare __child__: ComboboxChip;
    constructor(layout?: $.Layout<ComboboxChips>) {
        super(layout);
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$combobox = this.findAbove<Combobox>(proto => _instanceof(proto, Combobox));
        if (this.$combobox) this.$combobox.$chips = this;
        return this;
    }

    appendChip(value: any) {
        const $item = this.$combobox?.itemMap.get(value);
        if (!$item) throw 'ComboboxChips.addChip: $item not found';
        const $chip = this.chipMap.get(value) ?? $(ComboboxChip, {value, label: $item.label()});
        this.chipMap.set(value, $chip);
        if (this.protos.includes($chip)) return;
        this.append($chip);
        if (!$chip.builded) $chip.build();
        this.node?.replaceWith(...this.toDOM());
    }

    removeChip(value: any) {
        const $chip = this.chipMap.get(value);
        if (!$chip) throw 'ComboboxChips.removeChip: $chip not found';
        $chip.remove();
        $chip.removeNode();
    }

    switch(dir: 'left' | 'right') {
        const $focusedChip = this.$focusedChip;
        const chips = this.children;
        const currentPosition = $focusedChip ? chips.indexOf($focusedChip) : dir === 'left' ? 0 : -1;
        let targetIndex = dir === 'left' ? currentPosition - 1 : currentPosition + 1;
        if (targetIndex < 0 || targetIndex >= chips.length) targetIndex = dir === 'left' ? -1 : 0;
        this.focus(targetIndex);
    }

    focus(index: number) {
        let $target = this.children.at(index);
        this.$focusedChip?.blur();
        $target?.focus();
    }
}

export interface ComboboxChipProps {
    value: OrSignal<any>;
    label: OrSignal<string>;
}

export class ComboboxChip extends ElementProto {
    static tagname = 'combobox-chip';
    $chips: ComboboxChips | null = _null;
    #value: any;
    #label: string = '';
    constructor(props: $.Props<ComboboxChipProps>, layout?: $.Layout<ComboboxChip>) {
        super('combobox-chip', props, () => {
            if (layout) layout(this);
            else {
                $([ this.#label ])
                $(ComboboxChipRemoveButton)
            }
        });
    }

    static {
        $.style(this, toCSS(this.tagname, {
            display: 'inline-flex',
            placeItems: 'center',
            fontSize: 'var(--text-xs)',
            padding: '0 calc(var(--spacing) * 1.5)',
            background: 'var(--secondary-bg)',
            borderRadius: 'calc(var(--radius) * .6)',
            height: 'calc(var(--spacing) * 5.25)',
            marginBlock: 'calc(var(--spacing))',

            '&[focus]': {
                outline: `2px solid var(--input)`
            },

            'button[ui="combobox-chip-remove"]': {
                background: 'unset',
                border: 'unset',
                color: 'oklch(from var(--fg) l c h / .9)',
                paddingInlineStart: 'calc(var(--spacing) * 1.5)',

                'icon': {
                    height: 'calc(var(--spacing) * 3.25)',
                    width: 'calc(var(--spacing) * 3.25)'
                }
            }
        }))
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$chips = this.findAbove<ComboboxChips>(proto => _instanceof(proto, ComboboxChips));
        return this;
    }

    override props({ value, label, ...props }: $.Props<ComboboxItemProps>): void {
        super.props(props);
        this.value(value);
        this.label(label);
    }

    value(): any;
    value(val?: OrSignal<any>): void;
    value(val?: OrSignal<any>) {
        if (!arguments.length) return this.#value;
        if (isUndefined(val)) return;
        $.resolve(val, val => {
            this.$chips?.chipMap.delete(val);
            this.$chips?.chipMap.set(val, this);
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

    delete() {
        this.$chips?.$combobox?.select(this.#value, false);
    }

    focus() {
        this.attr('focus', '')
        if (this.$chips) this.$chips.$focusedChip = this;
    }

    blur() {
        this.attr('focus', _null)
        if (this.$chips) this.$chips.$focusedChip = _null;
    }
}

export class ComboboxChipRemoveButton extends ElementProto<HTMLButtonElement> {
    static tagname = 'button';
    $chip: ComboboxChip | null = _null;
    constructor(props: $.Props<{}, HTMLButtonElement>, layout?: $.Layout<ComboboxChipRemoveButton>) {
        super('button', {ui: 'combobox-chip-remove', ...props}, () => {
            if (layout) layout(this);
            else $(Icon, {svg: x_svg})
        })

        this.on('click', () => {
            this.$chip?.$chips?.$combobox?.select(this.$chip.value(), false)
        })
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$chip = this.findAbove<ComboboxChip>(proto => _instanceof(proto, ComboboxChip));
        return this;
    }
}