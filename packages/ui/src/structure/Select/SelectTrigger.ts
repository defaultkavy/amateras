import { ElementProto, TextProto } from "@amateras/core";
import { _null, isNull, _instanceof } from "@amateras/utils";
import { Select } from "./Select";

export interface SelectTriggerProps {
    placeholder?: OrSignal<string | null>;
}

export class SelectTrigger extends ElementProto {
    $placeholder = new TextProto('');
    $select: Select | null = _null;
    constructor(props: $.Props<SelectTriggerProps>, layout?: $.Layout<SelectTrigger>) {
        super('selector-trigger', {tabindex: 0, ...props}, () => {
            $(this.$placeholder);
            layout?.(this)
        });
        this.on('click', e => isNull(this.$select?.attr('opened')) ? this.$select.open() : this.$select?.close())
    }

    override props({ placeholder, ...props }: $.Props<SelectTriggerProps>): void {
        super.props(props);
        this.placeholder(placeholder ?? _null);
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$select = this.findAbove<Select>(proto => _instanceof(proto, Select));
        if (this.$select) this.$select.$trigger = this;
        return this;
    }

    placeholder(text: OrSignal<string | null>) {
        $.resolve(text, text => {
            this.$placeholder.content = text ?? 'Select';
            if (this.$placeholder.node) this.$placeholder.node.textContent = text;
        });
    }

    static {
        $.style(this, 'selector-trigger{display:block;padding:0.1rem 0.2rem;border:0.1rem solid #a5a5a5;width:100%;min-height:1rem;box-sizing:border-box;background:white;color:black;font-size:0.875rem;&:hover{background:#eeeeee}}')
    }
}