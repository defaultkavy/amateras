import { type FloatDisconnect, float } from "#lib/float";
import { toUICSS } from "#lib/toCSS";
import { ElementProto, onclient, Proto } from "@amateras/core";
import { _null, _Array_from, _instanceof, isNull, isUndefined, forEach, map } from "@amateras/utils";
import type { ComboboxChips } from "./ComboboxChips";
import { type ComboboxList, ComboboxItem } from "./ComboboxList";
import { item_css } from "../../style/combobox_style";
import { content_css } from "../../style/content_style";

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
    #values = new Set<any>();
    #initialized = false;
    private disconnect: FloatDisconnect | null = _null;
    constructor(props: $.Props<ComboboxProps>, layout?: $.Layout<Combobox>) {
        super('combobox', props, layout);
    }
    
    static {
        $.style(this, toUICSS(this.tagname, {
            display: 'inline-block',
            width: '10rem',
            userSelect: 'none'
        }))
    }

    override toDOM(children = true): HTMLElement[] {
        const nodes = super.toDOM(false);
        if (!this.#initialized && children && this.$trigger) {
            this.node?.append(...this.$trigger.toDOM());
            this.$content?.toDOM();
            this.#initialized = true
        }
        return nodes;
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
            this.dispatch('combobox_select', [value])
        } else {
            this.#values.delete(value);
            this.dispatch('combobox_unselect', [value])
        }

        this.$chips?.toDOM();
        this.dispatch('combobox_input', []);
    }

    get selected() {
        return map(this.#values, value => this.itemMap.get(value)!)
    }

    values(): any[]
    values(values?: OrSignal<any[]>): void;
    values(values?: OrSignal<any[]>) {
        if (!arguments.length) return _Array_from(this.#values);
        if (isUndefined(values)) return;
        $.resolve(values, values => {
            this.#values = new Set(values);
            forEach(this.itemMap.values(), $item => {
                $item.selected(this.#values.has($item.value()));
            })
            this.$chips?.toDOM();
        })
    }
}

export class ComboboxTrigger extends ElementProto {
    static tagname = 'combobox-trigger'
    $combobox: Combobox | null = _null;
    constructor(props: $.Props, layout?: $.Layout<ComboboxTrigger>) {
        super('combobox-trigger', props, layout);

        this.on('dragover', e => this.$combobox?.$chips?.dragover(e))
        this.on('dragend', e => this.$combobox?.$chips?.dragend())
    }

    static {
        $.style(this, toUICSS(this.tagname, {
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
        super('input', {ui: 'combobox-input', autocomplete: 'off', ...props}, layout);
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
                    if (e.currentTarget.value.length === 0) this.$combobox?.$chips?.visibleChildren.at(-1)?.delete();
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
                    this.clearValue();
                    return;
                }
            }

            if (e.currentTarget.value.length) this.$combobox?.$chips?.$focusedChip?.blur();
        })
    }

    static {
        $.style(this, toUICSS('input[ui="combobox-input"]', {
            display: 'inline',
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
            outline: 'unset',

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

    clearValue() {
        if (this.node) this.node.value = '';
        this.$combobox?.$list?.filter('');
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
        $.style(this, toUICSS(this.tagname, content_css))
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
        $.style(this, toUICSS(this.tagname, {
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
        export interface ProtoEventMap<P extends Proto> {
            combobox_create: [string];
            combobox_select: [string];
            combobox_unselect: [string];
            combobox_input: [];
        }
    }
}