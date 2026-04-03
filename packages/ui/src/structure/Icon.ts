import { toCSS } from "#lib/toCSS";
import { ElementProto } from "@amateras/core";

export interface IconProps {
    svg: OrSignal<string>
}

export class Icon extends ElementProto {
    static tagname = 'icon';
    constructor(props: $.Props<IconProps>, layout?: $.Layout<Icon>) {
        super(Icon.tagname, props, layout)
    }

    static {
        $.style(this, toCSS(this.tagname, {
            display: 'inline-block',
            verticalAlign: 'middle',
            height: '1rem',
            width: '1rem',

            'svg': {
                display: 'block',
                height: 'auto',
                width: '100%'
            }
        }))
    }

    override props({ svg, ...props }: $.Props<IconProps>): void {
        super.props(props);
        this.svg(svg);
    }

    svg(svg: OrSignal<string>) {
        $.resolve(svg, svg => {
            this.innerHTML(svg);
        })
    }
}