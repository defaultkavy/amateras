import { type FloatDisconnect, float } from "#lib/float";
import { toCSS } from "#lib/toCSS";
import { ElementProto, onclient } from "@amateras/core";
import { _null, _Array_from, _instanceof, isNull, isUndefined, forEach } from "@amateras/utils";
import type { ComboboxChips } from "./ComboboxChips";
import { type ComboboxList, ComboboxItem } from "./ComboboxList";
import { item_css } from "#lib/combobox_style";

export interface ComboboxProps {
    values?: OrSignal<any[]>;
}

export class Combobox extends ElementProto {
    static tagname = 'combobox'
    $trigger: ComboboxTrigger | null = _null;
    $content: ComboboxContent | null = _null;
    $list: ComboboxList | null = _null;
    $chips: ComboboxChips | null = _null;
    $input: ComboboxInput | null = _null;
    itemMap = new Map<any, ComboboxItem>();
    #values = new Set<string>();
    private disconnect: FloatDisconnect | null = _null;
    constructor(props: $.Props<ComboboxProps>, layout?: $.Layout<Combobox>) {
        super('combobox', props, layout);
    }
    
    static {
        $.style(this, toCSS(this.tagname, {
            display: 'inline-block',
            width: '10rem',
            userSelect: 'none'
        }))
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        forEach(this.#values, value => this.select(value));
        return this;
    }

    override toDOM(children = true): HTMLElement[] {
        super.toDOM(false);
        if (children && this.$trigger) {
            this.node?.append(...this.$trigger.toDOM());
            this.$content?.toDOM();
        }
        return [this.node!]
    }

    override props({ values, ...props }: $.Props<ComboboxProps>): void {
        super.props(props);
        this.values(values);
    }
    
    open() {
        this.attr('opened', '');
        if (onclient() && this.$content) {
            this.disconnect = float(this.$trigger?.node!, this.$content.node!);
            document.body.append(...this.$content.toDOM());
            if (this.$input) this.$list?.filter(this.$input.node?.value ?? '')
        }
    }

    close() {
        this.attr('opened', _null);
        if (!onclient()) return;
        this.$content?.removeNode();
        this.disconnect?.();
        this.disconnect = _null;
    }

    select(value: any, bool = true) {
        const $item = this.itemMap.get(value);
        if (!$item) return;
        $item.selected(bool);
        if (bool) {
            this.#values.add(value);
            this.$chips?.appendChip(value);
            this.dispatch('combobox_select', [value])
        } else {
            this.#values.delete(value);
            this.$chips?.removeChip(value);
            this.dispatch('combobox_unselect', [value])
        }

        this.dispatch('combobox_input', [value])
    }

    get selected() {
        return _Array_from(this.itemMap.values()).filter($item => $item.selected())
    }

    values(): any[]
    values(values?: OrSignal<any[]>): void;
    values(values?: OrSignal<any[]>) {
        if (!arguments.length) return _Array_from(this.#values);
        if (isUndefined(values)) return;
        $.resolve(values, values => {
            this.#values = new Set(values);
        })
    }
}

export class ComboboxTrigger extends ElementProto {
    static tagname = 'combobox-trigger'
    $combobox: Combobox | null = _null;
    constructor(props: $.Props, layout?: $.Layout<ComboboxTrigger>) {
        super('combobox-trigger', props, layout);
    }

    static {
        $.style(this, toCSS(this.tagname, {
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: 'calc(var(--spacing) * 1.25)',
            placeItems: 'center',
            boxSizing: 'border-box',
            border: '1px solid var(--input)',
            background: 'color-mix(in oklch, var(--input) 30%, transparent)',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem',
            fontWeight: 'var(--font-weight-medium)',
            lineHeight: '1',
            padding: `0 calc(var(--spacing) * 1.25)`,

            '&:hover': {
                background: 'color-mix(in oklch, var(--input) 50%, transparent)'
            },

            '&:focus-within': {
                outline: '0.1rem solid var(--border)'
            }
        }))
    }
    
    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$combobox = this.findAbove<Combobox>(proto => _instanceof(proto, Combobox));
        if (this.$combobox) this.$combobox.$trigger = this;
        return this;
    }
}

export class ComboboxInput extends ElementProto<HTMLInputElement> {
    $combobox: Combobox | null = _null;
    constructor(props: $.Props<{}, HTMLInputElement>, layout?: $.Layout<ComboboxInput>) {
        super('input', {ui: 'combobox-input', ...props}, layout);
        this.on('focus', e => isNull(this.$combobox?.attr('opened')) && this.$combobox.open())
        this.on('blur', e => {
            this.$combobox?.close();
            this.$combobox?.$chips?.$focusedChip?.blur();
        })
        this.on('input', e => {
            this.$combobox?.$list?.filter(e.currentTarget.value)
            this.$combobox?.$list?.focusFirstItem();
        })
        this.on('keydown', e => {
            switch (e.key) {
                case 'ArrowDown': {
                    e.preventDefault();
                    this.$combobox?.$list?.switch('down');
                    return;
                }
                case 'ArrowUp': {
                    e.preventDefault();
                    this.$combobox?.$list?.switch('up')
                    return;
                }
                case 'Backspace': {
                    if (e.currentTarget.value.length === 0) this.$combobox?.$chips?.children.at(-1)?.delete();
                    return;
                }
                case 'ArrowRight': {
                    if (e.currentTarget.value.length === 0) this.$combobox?.$chips?.switch('right');
                    return;
                }
                case 'ArrowLeft': {
                    if (e.currentTarget.value.length === 0) this.$combobox?.$chips?.switch('left');
                    return;
                }
            }
        })

        this.on('keyup', e => {
            switch (e.key) {
                case 'Escape': {
                    e.preventDefault();
                    this.$combobox?.close();
                    this.$combobox?.$trigger?.node?.focus()
                    return;
                }
                case 'Delete': {
                    const $targetChip = this.$combobox?.$chips?.$focusedChip;
                    this.$combobox?.$chips?.switch('right');
                    $targetChip?.delete();
                    return;
                }
                case 'Tab':
                case 'Enter': {
                    e.preventDefault();
                    const $focusedItem = this.$combobox?.$list?.$focusedItem;
                    if (!$focusedItem) return;
                    if (_instanceof($focusedItem, ComboboxItem)) {
                        this.$combobox?.select($focusedItem.value());
                    } else {
                        this.dispatch('combobox_create', [e.currentTarget.value], {bubbles: true})
                    }
                    e.currentTarget.value = '';
                    this.$combobox?.$list?.filter('');
                    return;
                }
            }

            if (e.currentTarget.value.length) this.$combobox?.$chips?.$focusedChip?.blur();
        })
    }

    static {
        $.style(this, toCSS('input[ui="combobox-input"]', {
            border: 'unset',
            background: 'unset',
            color: 'oklch(from var(--fg) l c h / .9)',
            fontSize: '0.875rem',
            fontWeight: 'var(--font-weight-medium)',
            fontFamily: 'inherit',
            lineHeight: '1',
            height: 'calc(var(--spacing) * 8)',
            flex: '1',
            minWidth: '2rem',
            padding: `0 calc(var(--spacing) * 1.25)`,

            '&:focus': {
                outline: 'unset'
            }
        }))
    }
    
    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$combobox = this.findAbove<Combobox>(proto => _instanceof(proto, Combobox));
        if (this.$combobox) this.$combobox.$input = this;
        return this;
    }
}

export class ComboboxContent extends ElementProto {
    static tagname = 'combobox-content';
    $combobox: Combobox | null = _null;
    $empty: ComboboxEmpty | null = _null;
    constructor(props: $.Props, layout?: $.Layout<ComboboxContent>) {
        super('combobox-content', props, layout);
    }

    static {
        $.style(this, toCSS(this.tagname, {
            position: 'absolute',
            top: '0',
            left: '0',
            maxHeight: '50dvh',
            overflowY: 'auto',
            display: 'block',
            boxSizing: 'border-box',
            border: '1px solid var(--input)',
            background: 'oklch(from var(--bg) l c h)',
            padding: 'calc(var(--spacing) * 2) calc(var(--spacing) * 1.25)',
            borderRadius: 'var(--radius)',
            userSelect: 'none',

            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--input) transparent',
        }))
    }
    
    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$combobox = this.findAbove<Combobox>(proto => _instanceof(proto, Combobox));
        if (this.$combobox) this.$combobox.$content = this;
        return this;
    }
}

export class ComboboxEmpty extends ElementProto {
    static tagname = 'combobox-empty'
    $content: ComboboxContent | null = _null;
    constructor(props: $.Props, layout?: $.Layout<ComboboxEmpty>) {
        super('combobox-empty', props, layout);
    }

    static {
        $.style(this, toCSS(this.tagname, {
            ...item_css
        }))
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$content = this.findAbove<ComboboxContent>(proto => _instanceof(proto, ComboboxContent));
        if (this.$content) this.$content.$empty = this;
        return this;
    }
}

declare global {
    export namespace $ {
        export interface ProtoEventMap {
            combobox_create: [string];
            combobox_select: [string];
            combobox_unselect: [string];
            combobox_input: [string];
        }
    }
}