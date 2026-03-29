import { ElementProto, onclient } from "@amateras/core";
import { _null, _instanceof } from "@amateras/utils";
import { Select } from "./Select";

export class SelectContent extends ElementProto {
    $select: Select | null = _null;
    constructor(props: $.Props, layout?: $.Layout<Select>) {
        super('selector-content', props, layout);
    }

    static {
        $.style(this, 'selector-content{position:absolute;top:0;left:0;display:block;box-sizing:border-box;border:0.1rem solid #a5a5a5;background:white;color:black;}')
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$select = this.findAbove<Select>(proto => _instanceof(proto, Select));
        if (this.$select) this.$select.$content = this;
        return this;
    }

    render() {
        if (!onclient()) return;
        let selectNode = this.$select?.node;
        if (!selectNode) return;
        let rect = selectNode.getBoundingClientRect();
        this.style({
            top: `${rect.top + rect.height}px`,
            left: `${rect.left}px`,
            minWidth: `${rect.width}px`
        })
    }
}