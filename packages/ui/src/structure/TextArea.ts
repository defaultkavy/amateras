import { toUICSS } from "#lib/toCSS";
import { ElementProto } from "@amateras/core";
import { input_css } from "../style/input_style";

export class TextArea extends ElementProto<HTMLTextAreaElement> {
    static tagname = 'textarea';
    constructor(props: $.Props<{}, HTMLTextAreaElement>, layout?: $.Layout<TextArea>) {
        super('textarea', {ui: 'textarea', ...props}, layout);
    }

    static {
        $.style(this, toUICSS('textarea[ui="textarea"]', {
            ...input_css,
            padding: `calc(var(--spacing) * 2.5)`,
            minHeight: `calc(var(--spacing) * 5 + 2rem)`,
            maxHeight: `calc(var(--spacing) * 5 + 10rem)`,
            fieldSizing: 'content',
            resize: 'none',
            height: 'unset'
        }))
    }
}