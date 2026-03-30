import { ElementProto } from "@amateras/core";
import { _null, isNull, _instanceof } from "@amateras/utils";
import { Select } from "./Select";
import { toCSS } from "#lib/toCSS";

export interface SelectTriggerProps {
    placeholder?: OrSignal<string | null>;
}

export class SelectTrigger extends ElementProto {
    static tagname = 'select-trigger'
    $select: Select | null = _null;
    constructor(props: $.Props<SelectTriggerProps>, layout?: $.Layout<SelectTrigger>) {
        super(SelectTrigger.tagname, {tabindex: 0, ...props}, layout);
        this.on('click', e => isNull(this.$select?.attr('opened')) ? this.$select.open() : this.$select?.close())
        this.on('keydown', e => {
            switch (e.key) {
                case ' ': {
                    e.preventDefault();
                    break;
                }
            }
        })
        this.on('keyup', e => {
            switch (e.key) {
                case ' ':
                case 'Enter': {
                    e.preventDefault();
                    this.$select?.open();
                    break;
                }
            }
        })
    }

    static {
        $.style(this, toCSS(this.tagname, {
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
        this.$select = this.findAbove<Select>(proto => _instanceof(proto, Select));
        if (this.$select) this.$select.$trigger = this;
        return this;
    }
}