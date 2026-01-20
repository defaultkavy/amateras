import { ElementProto } from "@amateras/core/structure/ElementProto";

export class Link extends ElementProto<HTMLAnchorElement> {
    constructor(attr: $.Props | null, layout?: $.Layout<ElementProto<HTMLAnchorElement>>) {
        super('a', attr, layout);
        this.on('click', e => {
            if (e.shiftKey || e.ctrlKey) return;
            e.preventDefault();
            let target = this.attr('target');
            let href = this.attr('href');
            if (href) {
                if (target === '_replace') $.replace(href) 
                else $.open(href, target)
            }
        })
    }
}