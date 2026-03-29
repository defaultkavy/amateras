import { ElementProto } from "@amateras/core";
import { _null, isUndefined, _instanceof } from "@amateras/utils";
import { Select } from "./Select";

export interface SelectItemProps {
    value: OrSignal<any>
}

export class SelectItem extends ElementProto {
    $select: Select | null = _null;
    #value: any = _null;
    constructor(props: $.Props, layout?: $.Layout<Select>) {
        super('selector-item', {tabindex: 0, ...props}, layout);
        this.on('click', () => {
            this.$select?.close();
            this.select();
        })
    }

    static {
        $.style(this, 'selector-item{display:block;padding:0.1rem 0.2rem;font-size:0.875rem;&:hover{background:#a5a5a5;color:#000000}}')
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
        this.$select?.items.add(this);
        return this;
    }
}