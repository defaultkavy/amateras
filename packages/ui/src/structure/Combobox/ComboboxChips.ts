import { toUICSS } from "#lib/toCSS";
import { Icon } from "#structure/Icon";
import { ElementProto, ProxyProto } from "@amateras/core";
import { Utils } from '@amateras/utils';
import { x_svg } from "../../icon/x.svg";
import { Combobox } from "./Combobox";
import type { ComboboxItemProps } from "./ComboboxList";

export class ComboboxChips extends ProxyProto {
    $combobox: Combobox | null = Utils.Null;
    chipMap = new Map<any, ComboboxChip>();
    $focusedChip: ComboboxChip | null = Utils.Null;
    $draggedChip: ComboboxChip | null = Utils.Null;
    declare __child__: ComboboxChip;
    #dragValues: any[] = [];
    #cacheValues: any[] = [];
    #cacheChipNodes: Node[] = [];
    constructor(layout?: $.Layout<ComboboxChips>) {
        super(layout);
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$combobox = this.findAbove<Combobox>(proto => Utils.isInstanceof(proto, Combobox));
        if (this.$combobox) this.$combobox.$chips = this;
        return this;
    }

    override toDOM(): Node[] {
        const values = this.$combobox?.values() ?? [];
        if (!Utils.isEqual(values, this.#cacheValues)) {
            this.#cacheValues = [...values];
            Utils.forEach(this.children, $chip => $chip.removeNode())
            this.#cacheChipNodes = Utils.map(this.$combobox?.values(), value => {
                const $chip = this.chipMap.get(value);
                if (!$chip) return [];
                if (!$chip.builded) $chip.build();
                return $chip.toDOM();
            })?.flat() ?? [];
            this.node?.replaceWith(this.node, ...this.#cacheChipNodes)
        }
        return [this.node!, ...this.#cacheChipNodes]
    }

    switch(dir: 'left' | 'right') {
        const $focusedChip = this.$focusedChip;
        const chips = this.visibleChildren;
        const currentPosition = $focusedChip ? chips.indexOf($focusedChip) : dir === 'left' ? 0 : -1;
        let targetIndex = dir === 'left' ? currentPosition - 1 : currentPosition + 1;
        if (targetIndex < 0 || targetIndex >= chips.length) targetIndex = dir === 'left' ? -1 : 0;
        this.focus(targetIndex);
    }

    focus(index: number) {
        let $target = this.visibleChildren.at(index);
        this.$focusedChip?.blur();
        $target?.focus();
    }

    dragover(e: MouseEvent) {
        if (!this.$draggedChip?.node) return;
        if (!this.$combobox) return;
        const $chips = Utils.map(this.#cacheValues, value => this.chipMap.get(value)!);
        const $closest = $chips.reduce((closest, proto) => {
            const rect = proto.node!.getBoundingClientRect();
            const distanceX = e.x - rect.left - rect.width / 2;
            const distanceY = e.y - rect.top - rect.height / 2;
            const offset = Math.pow(distanceX, 2) + Math.pow(distanceY, 2);
            if (offset < closest.offset) return { offset, $chip: proto }
            else return closest;
        }, { offset: Number.POSITIVE_INFINITY, $chip: undefined as undefined | ComboboxChip }).$chip;

        if ($closest && $closest !== this.$draggedChip) {
            const rect = $closest.node!.getBoundingClientRect();
            const draggedValue = this.$draggedChip.value();
            const closestValue = $closest.value();

            const dragValuesArr = this.$combobox.values();
            dragValuesArr.splice(dragValuesArr.indexOf(draggedValue), 1);

            if (e.x < rect.left + rect.width / 2) {
                this.$combobox.$trigger?.node?.insertBefore(this.$draggedChip.node, $closest.node);
                dragValuesArr.splice(dragValuesArr.indexOf(closestValue), 0, draggedValue);
            }
            else {
                this.$combobox.$trigger?.node?.insertBefore(this.$draggedChip.node, $closest.node?.nextSibling ?? null)
                dragValuesArr.splice(dragValuesArr.indexOf(closestValue) + 1, 0, draggedValue);
            }
            this.#dragValues = dragValuesArr;
        }
    }

    dragend() {
        if (this.#dragValues.length) {
            this.$combobox?.values(this.#dragValues);
            this.$combobox?.dispatch('combobox_input', []);
        }
        this.#dragValues = [];
        this.$draggedChip?.removeClass('dragging');
        this.$draggedChip = null;
    }
    
    override mutate(): void {
        super.mutate();
        this.chipMap.clear();
        Utils.forEach(this.children, proto => {
            if (Utils.isInstanceof(proto, ComboboxChip)) {
                this.chipMap.set(proto.value(), proto)
            }
        })
        this.#cacheValues = [];
        this.toDOM();
    }
}

export interface ComboboxChipProps {
    value: OrSignal<any>;
}

export class ComboboxChip extends ElementProto {
    static tagname = 'combobox-chip';
    $chips: ComboboxChips | null = Utils.Null;
    #value: any;
    constructor(props: $.Props<ComboboxChipProps>, layout?: $.Layout<ComboboxChip>) {
        super('combobox-chip', {draggable: true, ...props}, layout);

        this.on('dragstart', () => {
            if (!this.$chips) return;
            this.$chips.$draggedChip = this;
            this.addClass('dragging');
        })
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            display: 'inline-flex',
            placeItems: 'center',
            fontSize: 'var(--text-xs)',
            padding: '0 calc(var(--spacing) * 1.5)',
            background: 'var(--secondary-bg)',
            borderRadius: 'calc(var(--radius) * .6)',
            height: 'calc(var(--spacing) * 5.25)',
            marginBlock: 'calc(var(--spacing))',
            cursor: 'grab',

            '&:active': {
                cursor: 'grabbing'
            },

            '&[focus]': {
                outline: `2px solid var(--input)`
            },

            '&.dragging': {
                background: 'var(--input)'
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
        this.$chips = this.findAbove<ComboboxChips>(proto => Utils.isInstanceof(proto, ComboboxChips));
        this.$chips?.chipMap.set(this.value(), this);
        return this;
    }

    override props({ value, ...props }: $.Props<ComboboxItemProps>): void {
        super.props(props);
        this.value(value);
    }

    value(): any;
    value(val?: OrSignal<any>): void;
    value(val?: OrSignal<any>) {
        if (!arguments.length) return this.#value;
        if (Utils.isUndefined(val)) return;
        $.resolve(val, val => {
            this.$chips?.chipMap.delete(val);
            this.$chips?.chipMap.set(val, this);
            this.#value = val;
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
        this.attr('focus', Utils.Null)
        if (this.$chips) this.$chips.$focusedChip = Utils.Null;
    }
}

export class ComboboxChipRemoveButton extends ElementProto<HTMLButtonElement> {
    static tagname = 'button';
    $chip: ComboboxChip | null = Utils.Null;
    constructor(props: $.Props<{}, HTMLButtonElement>, layout?: $.Layout<ComboboxChipRemoveButton>) {
        super('button', {ui: 'combobox-chip-remove', tabindex: '-1', ...props}, () => {
            if (layout) layout(this);
            else $(Icon, {svg: x_svg})
        })

        this.on('click', () => {
            this.$chip?.$chips?.$combobox?.select(this.$chip.value(), false)
        })
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$chip = this.findAbove<ComboboxChip>(proto => Utils.isInstanceof(proto, ComboboxChip));
        return this;
    }
}