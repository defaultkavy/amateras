import { ElementProto } from "@amateras/core";
import { Utils } from '@amateras/utils';
import { Select } from "./Select";
import { toUICSS } from "#lib/toCSS";
import { content_css } from "../../style/content_style";

export class SelectContent extends ElementProto {
    static tagname = 'select-content'
    $select: Select | null = Utils.Null;
    constructor(props: $.Props, layout?: $.Layout<Select>) {
        super(SelectContent.tagname, props, layout);
    }

    static {
        $.style(this, toUICSS(this.tagname, content_css))
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$select = this.findAbove<Select>(proto => Utils.isInstanceof(proto, Select));
        if (this.$select) this.$select.$content = this;
        return this;
    }
}