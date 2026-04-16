import { ElementProto, onclient } from "@amateras/core";
import { _null, isUndefined } from "@amateras/utils";
import type { SelectContent } from "./SelectContent";
import type { SelectItem } from "./SelectItem";
import type { SelectTrigger } from "./SelectTrigger";
import { float, type FloatDisconnect } from "#lib/float";
import type { SelectValue } from "./SelectValue";
import { toCSS } from "#lib/toCSS";

export interface SelectProps {
    disabled?: OrSignal<boolean>;
    value?: OrSignal<any>;
}

export class Select extends ElementProto {
    static tagname = 'select-proto';
    $trigger: SelectTrigger | null = _null;
    $content: SelectContent | null = _null;
    private clickListener: ((e: MouseEvent) => void) | null = _null;
    #value: any = _null;
    selected: SelectItem | null = _null;
    itemMap = new Map<any, SelectItem>();
    $value: SelectValue | null = _null;
    private disconnect: FloatDisconnect | null = _null;
    constructor(props: $.Props<SelectProps>, layout?: $.Layout<Select>) {
        super(Select.tagname, props, layout);
        this.listen('i18nupdate', () => this.$value?.render());
    }

    static {
        $.style(this, toCSS(this.tagname, {
            display: 'inline-block',
            width: '10rem',
            userSelect: 'none'
        }))
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
            let $item = this.itemMap.get(val);
            this.selected = $item ?? _null;
            this.$value?.render();
            this.dispatch('selectvalue', [this, val], {bubbles: true})
        })
        this.node?.dispatchEvent(new Event('select-value'));
    }

    open() {
        this.attr('opened', '');
        if (onclient() && this.$content) {
            this.disconnect = float(this.$trigger?.node!, this.$content.node!);
            document.body.append(...this.$content.toDOM());
            this.clickListener = (e) => {
                if (e.target === this.$trigger?.node) return;
                if (e.target && this.$content?.node?.contains(e.target as Node)) return;
                this.close();
            }
            this.selected?.node?.focus();
            window.addEventListener('click', this.clickListener)
        }
    }

    close() {
        this.attr('opened', _null);
        if (!onclient()) return;
        this.$content?.removeNode();
        if (this.clickListener) window.removeEventListener('click', this.clickListener);
        this.disconnect?.();
        this.disconnect = _null;
    }

    override toDOM(children?: boolean): HTMLElement[] {
        super.toDOM(false);
        if (children && this.$trigger) {
            this.node?.append(...this.$trigger.toDOM());
            this.$content?.toDOM();
            this.$value?.render();
        }
        return [this.node!]
    }

    override toString(): string {
        let triggerHTML = this.$trigger?.toString() ?? '';
        return this.parseHTML({children: triggerHTML});
    }
}

declare global {
    export namespace $ {
        export interface ProtoEventMap {
            selectvalue: [$select: Select, value: any]
        }
    }
}