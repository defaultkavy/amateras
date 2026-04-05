import { ElementProto } from "@amateras/core";
import { _null, isUndefined, _instanceof } from "@amateras/utils";
import { Select } from "./Select";
import { toCSS } from "#lib/toCSS";
import { SelectContent } from "./SelectContent";

export interface SelectItemProps {
    value: OrSignal<any>
}

export class SelectItem extends ElementProto {
    static tagname = 'select-item'
    $select: Select | null = _null;
    $content: SelectContent | null = _null;
    #value: any = _null;
    constructor(props: $.Props, layout?: $.Layout<Select>) {
        super(SelectItem.tagname, {tabindex: 0, ...props}, layout);
        this.on('click', () => {
            this.$select?.close();
            this.select();
        })
        this.on('keydown', e => {
            let focus = (dir: 'up' | 'down') => {
                e.preventDefault();
                if (!this.$content) return;
                let items = this.$content?.findBelowAll<SelectItem>(proto => _instanceof(proto, SelectItem))
                let currentPosition = items.indexOf(this);
                let targetIndex = dir === 'up' ? currentPosition - 1 : currentPosition + 1;
                if (targetIndex < 0 || targetIndex >= items.length) targetIndex = dir === 'up' ? -1 : 0;
                let target = items.at(targetIndex);
                target?.node?.focus();
            }
            switch (e.key) {
                case 'ArrowDown': {
                    focus('down');
                    break;
                }
                case 'ArrowUp': {
                    focus('up')
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
                    this.$select?.$trigger?.node?.focus()
                    break;
                }
                case ' ':
                case 'Enter': {
                    e.preventDefault();
                    this.select();
                    this.$select?.close();
                    this.$select?.$trigger?.node?.focus()
                    break;
                }
            }
        })
    }

    static {
        $.style(this, toCSS(this.tagname, {
            display: 'block',
            boxSizing: 'border-box',
            padding: 'calc(var(--spacing) * 2) calc(var(--spacing) * 1.25)',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem',
            fontWeight: '500',
            lineHeight: '1',

            '&:hover, :not(:has(select-item:hover)) &:focus': {
                background: 'oklch(from var(--input) l c h / .1)'
            },
            '&:focus': {
                outline: 'none'
            }
        }))
    }

    value(): any;
    value(val: OrSignal<any>): void;
    value(val?: OrSignal<any>) {
        if (!arguments.length) return this.#value;
        if (isUndefined(val)) return;
        $.resolve(val, val => {
            this.#value = val;
        })
    }

    select() {
        if (!this.$select) return;
        this.$select.value(this.value())
    }

    override props({ value, ...props }: $.Props): void {
        super.props(props);
        this.value(value);
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$select = this.findAbove<Select>(proto => _instanceof(proto, Select));
        this.$content = this.findAbove<SelectContent>(proto => _instanceof(proto, SelectContent));
        if (this.$select && this.$select.value() === this.#value) this.$select.selected = this;
        this.$select?.itemMap.set(this.#value, this);
        return this;
    }
}