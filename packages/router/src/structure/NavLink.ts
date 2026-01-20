import { Link } from "#structure/Link";
import type { ElementProto } from "@amateras/core";
import { _null, toURL } from "@amateras/utils";

export class NavLink extends Link {
    constructor(attr: $.Props | null, layout?: $.Layout<ElementProto<HTMLAnchorElement>>) {
        super(attr, layout);
        this.global.router.navlinks.add(this);
    }

    checkActive() {
        let href = this.attr('href');
        if (!href) return;
        for (let path of this.global.router.matchPaths) {
            if (toURL(path).href === toURL(href).href) return this.attr('active', ''); 
        }
        this.attr('active', _null);
    }
}