import { toCSS } from "#lib/toCSS";
import { Icon } from "#structure/Icon";
import { chevron_down_svg } from "../../icon/chevron_down.svg";

export class SelectArrow extends Icon {
    constructor(props: $.Props) {
        super({svg: chevron_down_svg, ...props})
    }

    static {
        $.style(this, toCSS(`select-proto[opened] ${this.tagname}`, {
            rotate: '180deg'
        }))
    }
}