import { toCSS } from "#lib/toCSS";
import { ElementProto } from "@amateras/core";

export class Input extends ElementProto<HTMLInputElement> {
    static tagname = 'input';
    constructor(props: $.Props<{}, HTMLInputElement>, layout?: $.Layout<Input>) {
        super(Input.tagname, {ui: 'input', ...props}, layout)
    }

    static {
        $.style(this, toCSS('input[ui="input"]', {
            borderRadius: 'var(--radius)',
            height: 'calc(var(--spacing) * 8)',
            transition: '0.2s all ease',
            fontFamily: 'inherit',
            fontSize: 'var(--text-sm)',
            padding: `0 calc(var(--spacing) * 2.5)`,
            
            border: '1px solid oklch(from var(--input) l c h / .2)',
            background: 'oklch(from var(--input) l c h / .025)',
            color: 'oklch(from var(--fg) l c h / .9)',
            outline: '0.2rem solid transparent',

            '&:focus-visible': {
                outlineColor: 'var(--border)'
            },
        }))
    }
}