import { ElementProto, type ElementProtoBuilder } from "@amateras/core/structure/ElementProto";

export class Link extends ElementProto<HTMLAnchorElement> {
    constructor(attr: Partial<$.AttrMap> | null, builder: ElementProtoBuilder<ElementProto<HTMLAnchorElement>> | null) {
        super('a', attr, builder);
        this.on('click', e => {
            if (e.shiftKey || e.ctrlKey) return;
            e.preventDefault();
            let target = this.attr.get('target')
            let href = this.attr.get('href');
            if (href) {
                if (target === '_replace') $.replace(href) 
                else $.open(href, target)
            }
        })
    }
}