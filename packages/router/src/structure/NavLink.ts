import { Link } from "#structure/Link";
import { _null, toURL } from "@amateras/utils";

export class NavLink extends Link {
    constructor(attr: $.Props | null, layout?: $.Layout<NavLink>) {
        super(attr, layout as any);
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