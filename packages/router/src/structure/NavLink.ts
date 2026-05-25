import { Link } from "#structure/Link";
import { Utils } from '@amateras/utils';

export class NavLink extends Link {
    constructor(attr: $.Props | null, layout?: $.Layout<NavLink>) {
        super(attr, layout as any);
        this.global.router.navlinks.add(this);
    }

    override dispose(): void {
        this.global.router.navlinks.delete(this);
        super.dispose();
    }

    checkActive() {
        let href = this.attr('href');
        if (!href) return;
        for (let path of this.global.router.matchPaths) {
            if (Utils.toURL(path).href === Utils.toURL(href).href) return this.attr('active', ''); 
        }
        this.attr('active', Utils.Null);
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.checkActive();
        return this;
    }
}