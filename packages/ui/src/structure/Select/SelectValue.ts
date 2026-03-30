import { ElementProto, Proto, TextProto } from "@amateras/core";
import { Select } from "./Select";
import { _instanceof, _null, isString } from "@amateras/utils";

export interface SelectValuerProps {
    placeholder?: OrSignal<string | null> | Proto;
}

export class SelectValue extends ElementProto {
    static tagname = 'select-value';
    $select: Select | null = _null;
    $placeholder: Proto | null = _null;
    $text: TextProto = new TextProto('');
    constructor(props: $.Props<SelectValuerProps>, layout?: $.Layout<Select>) {
        super(SelectValue.tagname, props, layout);
    }

    override props({ placeholder, ...props }: $.Props<SelectValuerProps>): void {
        super.props(props);
        this.placeholder(placeholder ?? _null);
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$select = this.findAbove<Select>(proto => _instanceof(proto, Select));
        if (this.$select) this.$select.$value = this;
        return this;
    }

    placeholder(text: OrSignal<string | null> | Proto) {
        $.resolve(text, text => {
            if (isString(text)) $.context(Proto, this, () => this.$placeholder = new TextProto(text));
            else this.$placeholder = text;
            this.render();
        });
    }

    render() {
        let $content: Proto | TextProto | null = _null;
        if (this.$select?.selected) {
            $content = this.$text;
            this.$text.content = this.$select.selected.text;
        } else if (this.$placeholder) {
            $content = this.$placeholder;
        }
        if (!$content) return;
        if (!$content.builded) $content.build()
        this.replaceProtos($content);
        this.node?.replaceChildren(...$content.toDOM())
    }
}