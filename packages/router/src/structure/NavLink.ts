import { Link } from "#structure/Link";
import { Utils } from '@amateras/utils';

export interface NavLinkProps {
    exact?: boolean;
}

export class NavLink extends Link {
    constructor(props: $.Props<NavLinkProps> | null, layout?: $.Layout<NavLink>) {
        super(props, layout as any);
        this.global.router.navlinks.add(this);
    }

    override dispose(): void {
        this.global.router.navlinks.delete(this);
        super.dispose();
    }

    checkActive() {
        let href = this.attr('href');
        if (!href) return;
        const paths = this.global.router.matchPaths;
        for (let path of paths) {
            if (this.attr('exact') === 'true' && paths.indexOf(path) !== paths.length - 1) continue;
            if (Utils.toURL(path).href.replace(/\/$/, '') === Utils.toURL(href).href.replace(/\/$/, '')) return this.attr('active', '');
        }
        this.attr('active', Utils.Null);
    }

    override build(cascading?: boolean): this {
        super.build(cascading);
        this.checkActive();
        return this;
    }
}