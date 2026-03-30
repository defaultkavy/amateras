import { ElementProto } from "@amateras/core";
import { _null, _instanceof } from "@amateras/utils";
import { Select } from "./Select";
import { toCSS } from "#lib/toCSS";

export class SelectContent extends ElementProto {
    static tagname = 'select-content'
    $select: Select | null = _null;
    constructor(props: $.Props, layout?: $.Layout<Select>) {
        super(SelectContent.tagname, props, layout);
    }

    static {
        $.style(this, toCSS(this.tagname, {
            position: 'absolute',
            top: '0',
            left: '0',
            display: 'block',
            boxSizing: 'border-box',
            border: '1px solid var(--input)',
            background: 'oklch(from var(--bg) l c h)',
            padding: 'calc(var(--spacing) * 2) calc(var(--spacing) * 1.25)',
            borderRadius: 'var(--radius)',
            userSelect: 'none'
        }))
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$select = this.findAbove<Select>(proto => _instanceof(proto, Select));
        if (this.$select) this.$select.$content = this;
        return this;
    }
}