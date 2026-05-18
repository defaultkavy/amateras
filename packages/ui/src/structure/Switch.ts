import { toUICSS } from "#lib/toCSS";
import { ElementProto } from "@amateras/core";

export class Switch extends ElementProto {
    static tagname = 'input';
    constructor(props: $.Props<{}, HTMLInputElement>, layout?: $.Layout<Switch>) {
        super('input', {type: 'checkbox', ui: 'switch', ...props}, layout);
    }

    static {
        $.style(this, toUICSS('input[ui="switch"]', {
            appearance: 'none',
            display: 'inline-flex',
            height: 'calc(var(--spacing) * 5)',
            width: 'calc(var(--spacing) * 9)',
            background: 'color-mix(in oklab, var(--input) 80%, transparent)',
            border: 'none',
            placeItems: 'center',
            borderRadius: 'calc(var(--spacing) * 5)',
            transition: 'all .3s ease',
            padding: '0',
            flexShrink: '0',

            '&::after': {
                content: '""',
                display: 'block',
                height: 'calc(var(--spacing) * 5)',
                width: 'calc(var(--spacing) * 5)',
                background: 'var(--fg)',
                borderRadius: 'var(--radius-round)',
                transition: 'all .3s ease'
            },

            '&:checked': {
                background: 'var(--primary-bg)',

                '&::after': {
                    height: 'calc(var(--spacing) * 4.5)',
                    width: 'calc(var(--spacing) * 4.5)',
                    translate: 'calc(115% - var(--spacing)) 0',
                    background: 'var(--bg)'
                }
            }
        }))
    }
}