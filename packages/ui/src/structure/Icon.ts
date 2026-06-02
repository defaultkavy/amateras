import { toUICSS } from "#lib/toCSS";
import { ElementProto } from "@amateras/core";

export interface IconProps {
    svg: OrSignal<string>,
    size?: OrSignal<string>
}

export class Icon extends ElementProto {
    static tagname = 'icon';
    constructor(props: $.Props<IconProps>, layout?: $.Layout<Icon>) {
        super(Icon.tagname, props, layout)
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            display: 'inline-block',
            verticalAlign: 'middle',
            // height: 'attr(size type(<length>), 1rem)',
            // width: 'attr(size type(<length>), 1rem)',
            height: '1rem',
            width: '1rem',

            'svg': {
                display: 'block',
                height: 'auto',
                width: '100%'
            }
        }))
    }

    override props({ size, svg, ...props }: $.Props<IconProps>): void {
        super.props(props);
        this.svg(svg);
        this.size(size);
    }

    svg(svg: OrSignal<string>) {
        $.resolve(svg, svg => {
            this.innerHTML(svg);
        })
    }

    size(size: OrSignal<string> | undefined) {
        $.resolve(size, size => {
            this.style({
                height: size,
                width: size
            })
        })
    }
}