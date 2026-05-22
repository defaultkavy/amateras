import { ElementProto } from "@amateras/core";
import { Utils } from '@amateras/utils';
import { Select } from "./Select";
import { toUICSS } from "#lib/toCSS";
import { content_css } from "../../style/content_style";
import type { SelectItem } from "./SelectItem";

export class SelectContent extends ElementProto {
    static tagname = 'select-content'
    $select: Select | null = Utils.Null;
    $focusedItem: SelectItem | null = Utils.Null;
    declare __protos__: SelectItem;
    declare __child__: SelectItem;
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

    switch(dir: 'up' | 'down') {
        const $focusedItem = this.$focusedItem;
        const items = this.visibleChildren;
        const currentPosition = $focusedItem ? items.indexOf($focusedItem) : dir === 'up' ? 0 : -1;
        let targetIndex = dir === 'up' ? currentPosition - 1 : currentPosition + 1;
        if (targetIndex < 0 || targetIndex >= items.length) targetIndex = dir === 'up' ? -1 : 0;
        this.focus(targetIndex);
    }

    focus(index: number) {
        let $target = this.visibleChildren.at(index);
        this.$focusedItem?.blur();
        $target?.focus();
    }
}