import { ElementProto } from "@amateras/core/structure/ElementProto";

export class Link extends ElementProto<HTMLAnchorElement> {
    constructor(attr: $.Props | null, layout?: $.Layout<ElementProto<HTMLAnchorElement>>) {
        super('a', attr, layout);
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