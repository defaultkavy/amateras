import { ElementProto, onclient, Proto } from "@amateras/core";
import { Utils } from '@amateras/utils';
import type { SelectContent } from "./SelectContent";
import { SelectItem } from "./SelectItem";
import type { SelectTrigger } from "./SelectTrigger";
import { float, type FloatDisconnect } from "#lib/float";
import type { SelectValue } from "./SelectValue";
import { toUICSS } from "#lib/toCSS";

export interface SelectProps {
    disabled?: OrSignal<boolean>;
    value?: OrSignal<any>;
}

export class Select extends ElementProto {
    static tagname = 'select-proto';
    $trigger: SelectTrigger | null = Utils.Null;
    $content: SelectContent | null = Utils.Null;
    #value: any = Utils.Null;
    selected: SelectItem | null = Utils.Null;
    itemMap = new Map<any, SelectItem>();
    $value: SelectValue | null = Utils.Null;
    private disconnect: FloatDisconnect | null = Utils.Null;
    #initialized = false;
    constructor(props: $.Props<SelectProps>, layout?: $.Layout<Select>) {
        super(Select.tagname, props, layout);
        this.listen('i18nupdate', () => this.$value?.render());
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            display: 'inline-block',
            width: '10rem',
            userSelect: 'none'
        }))
    }

    override props({value, disabled, ...props}: $.Props<SelectProps>): void {
        super.props(props);
        this.disabled(disabled);
        this.value(value);
    }

    disabled(): boolean;
    disabled(bool?: OrSignal<boolean>): void
    disabled(bool?: OrSignal<boolean>) {
        if (!arguments.length) return this.attr('disabled') === '';
        if (Utils.isUndefined(bool)) return;
        $.resolve(bool, bool => {
            this.attr('disabled', bool ? '' : Utils.Null);
        });
    }

    value(): any;
    value(val?: OrSignal<any>): void;
    value(val?: OrSignal<any>) {
        if (!arguments.length) return this.#value;
        if (Utils.isUndefined(val)) return;
        $.resolve(val, val => {
            this.#value = val;
            let $item = this.itemMap.get(val);
            this.selected = $item ?? Utils.Null;
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
            this.selected?.focus();
        }
    }

    close() {
        this.attr('opened', Utils.Null);
        if (!onclient()) return;
        this.$content?.removeNode();
        this.disconnect?.();
        this.disconnect = Utils.Null;
    }

    override toDOM(children = true): HTMLElement[] {
        const nodes = super.toDOM(false);
        if (!this.#initialized && children && this.$trigger) {
            this.#initialized = true;
            this.node?.append(...this.$trigger.toDOM());
            this.$content?.toDOM();
            this.$value?.render();
        }
        return nodes;
    }

    override toString(): string {
        let triggerHTML = this.$trigger?.toString() ?? '';
        return this.parseHTML({children: triggerHTML});
    }
}

declare global {
    export namespace $ {
        export interface ProtoEventMap<P extends Proto> {
            selectvalue: [$select: Select, value: any]
        }
    }
}