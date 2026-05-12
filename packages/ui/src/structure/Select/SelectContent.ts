import { ElementProto } from "@amateras/core";
import { _null, _instanceof } from "@amateras/utils";
import { Select } from "./Select";
import { toCSS } from "#lib/toCSS";
import { content_css } from "../../style/content_style";

export class SelectContent extends ElementProto {
    static tagname = 'select-content'
    $select: Select | null = _null;
    constructor(props: $.Props, layout?: $.Layout<Select>) {
        super(SelectContent.tagname, props, layout);
    }

    static {
        $.style(this, toCSS(this.tagname, content_css))
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$select = this.findAbove<Select>(proto => _instanceof(proto, Select));
        if (this.$select) this.$select.$content = this;
        return this;
    }
}