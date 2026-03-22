import { ElementProto } from "@amateras/core";
import { is } from "@amateras/utils";
import { Waterfall } from "./Waterfall";

export class WaterfallItem extends ElementProto {
    ratio = 0;
    constructor(props: $.Props, layout?: $.Layout<WaterfallItem>) {
        super('waterfall-item', props, layout);
    }

    static {
        $.style(WaterfallItem, 'waterfall-item{display:block;position:absolute}')
    }

    override toDOM(children?: boolean): HTMLElement[] {
        super.toDOM(children);
        const $waterfall = this.findAbove<Waterfall>(proto => is(proto, Waterfall));
        this.node?.querySelectorAll('img').forEach(img => $waterfall?.observer?.observe(img));
        return [this.node!];
    }
}