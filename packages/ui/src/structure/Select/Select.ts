import { ElementProto, onclient } from "@amateras/core";
import { _Array_from, _null, isUndefined } from "@amateras/utils";
import type { SelectContent } from "./SelectContent";
import type { SelectItem } from "./SelectItem";
import type { SelectTrigger } from "./SelectTrigger";

export interface SelectProps {
    disabled?: OrSignal<boolean>;
    value?: OrSignal<any>;
}

export class Select extends ElementProto {
    $trigger: SelectTrigger | null = _null;
    $content: SelectContent | null = _null;
    private clickListener: ((e: MouseEvent) => void) | null = _null;
    #value: any = _null;
    selected: SelectItem | null = _null;
    items = new Set<SelectItem>();
    constructor(props: $.Props<SelectProps>, layout?: $.Layout<Select>) {
        super('selector', props, layout);
        this.listen('i18nupdate', () => this.renderValue());
    }

    static {
        $.style(this, 'selector{display:inline-block;width:10rem;user-select:none}')
    }

    override props({value, disabled, ...props}: $.Props<SelectProps>): void {
        super.props(props);
        if (disabled) this.disabled(disabled);
        this.value(value);
    }

    disabled(): boolean;
    disabled(bool: OrSignal<boolean>): void
    disabled(bool?: OrSignal<boolean>) {
        if (!arguments.length) return this.attr('disabled') === '';
        $.resolve(bool, bool => {
            this.attr('disabled', bool ? '' : _null);
        });
    }

    value(): any;
    value(val: OrSignal<any>): void;
    value(val?: OrSignal<any>) {
        if (!arguments.length) return this.#value;
        if (isUndefined(val)) return;
        $.resolve(val, val => {
            this.#value = val;
            this.renderValue();
        })
        this.node?.dispatchEvent(new Event('select-value'));
    }

    private renderValue() {
        this.selected = _Array_from(this.items).find(item => item.value() === this.#value) ?? _null;
        if (onclient()) {
            let placeholderNode = this.$trigger?.$placeholder.node;
            if (placeholderNode && this.selected) placeholderNode.textContent = this.selected.text;
        } 
        if (this.selected && this.$trigger) this.$trigger.$placeholder.content = this.selected.text;
    }

    open() {
        this.attr('opened', '');
        if (onclient() && this.$content) {
            this.$content.render();
            document.body?.append(...this.$content.toDOM());
            this.clickListener = (e) => {
                if (e.target === this.$trigger?.node) return;
                if (e.target && this.$content?.node?.contains(e.target as Node)) return;
                this.close();
            }
            window.addEventListener('click', this.clickListener)
        }
    }

    close() {
        this.attr('opened', _null);
        if (!onclient()) return;
        this.$content?.removeNode();
        if (this.clickListener) window.removeEventListener('click', this.clickListener);
    }

    override toDOM(children?: boolean): HTMLElement[] {
        super.toDOM(false);
        if (children && this.$trigger) {
            this.node?.append(...this.$trigger.toDOM());
            this.$content?.toDOM();
            this.renderValue();
        }
        return [this.node!]
    }

    override toString(): string {
        let triggerHTML = this.$trigger?.toString() ?? '';
        return this.parseHTML({children: triggerHTML});
    }
}