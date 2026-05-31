import { toUICSS } from "#lib/toCSS";
import { ElementProto } from "@amateras/core";

export class TextBlock extends ElementProto<HTMLPreElement> {
    static tagname = 'textblock'
    constructor(props: $.Props, layout?: $.Layout<TextBlock>) {
        super('textblock', props, layout)
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            display: 'block',
            whiteSpace: 'pre',
            fontSize: 'var(--text-sm)',
            textWrap: 'auto',
        }))
    }
}