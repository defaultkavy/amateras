import { ElementProto } from "@amateras/core";
import { Utils } from '@amateras/utils';
import { Select } from "./Select";
import { toUICSS } from "#lib/toCSS";

export interface SelectTriggerProps {
    placeholder?: OrSignal<string | null>;
}

export class SelectTrigger extends ElementProto {
    static tagname = 'select-trigger'
    $select: Select | null = Utils.Null;
    constructor(props: $.Props<SelectTriggerProps>, layout?: $.Layout<SelectTrigger>) {
        super(SelectTrigger.tagname, {tabindex: 0, ...props}, layout);
        this.on('click', e => Utils.isNull(this.$select?.attr('opened')) ? this.$select.open() : this.$select?.close())
        this.on('blur', e => this.$select?.close())
        this.on('keydown', e => {
            switch (e.key) {
                case 'ArrowDown': {
                    e.preventDefault();
                    if (!this.$select?.hasAttr('opened')) return this.$select?.open();
                    this.$select?.$content?.switch('down');
                    break;
                }
                case 'ArrowUp': {
                    e.preventDefault();
                    if (!this.$select?.hasAttr('opened')) return this.$select?.open();
                    this.$select?.$content?.switch('up');
                    break;
                }
                case ' ': {
                    e.preventDefault();
                    break;
                }
            }
        })
        this.on('keyup', e => {
            switch (e.key) {
                case 'Escape': {
                    e.preventDefault();
                    this.$select?.close();
                    break;
                }
                case ' ':
                case 'Enter': {
                    e.preventDefault();
                    if (!this.$select?.hasAttr('opened')) return this.$select?.open();
                    this.$select?.$content?.$focusedItem?.select();
                    this.$select?.close();
                    break;
                }
            }
        })
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            display: 'flex',
            gap: '0.5rem',
            placeContent: 'space-between',
            placeItems: 'center',
            boxSizing: 'border-box',
            border: '1px solid var(--input)',
            background: 'color-mix(in oklch, var(--input) 30%, transparent)',
            padding: 'calc(var(--spacing) * 2) calc(var(--spacing) * 2.5)',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem',
            fontWeight: 'var(--font-weight-medium)',
            lineHeight: '1',

            '&:hover': {
                background: 'color-mix(in oklch, var(--input) 50%, transparent)'
            },
            '&:focus': {
                outline: '0.1rem solid var(--border)'
            },

            '*': {
                pointerEvents: 'none',
            }
        }))
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$select = this.findAbove<Select>(proto => Utils.isInstanceof(proto, Select));
        if (this.$select) this.$select.$trigger = this;
        return this;
    }
}