import { toCSS } from "#lib/toCSS";
import { ElementProto } from "@amateras/core";

export interface ButtonProps {
    variant?: 'primary' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link' | string & {};
    size?: 'base' | 'icon' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg' | string & {}
}

export class Button extends ElementProto<HTMLButtonElement> {
    static tagname = 'button';
    constructor(props: $.Props<ButtonProps>, layout?: $.Layout<Button>) {
        super(Button.tagname, props, layout)
    }

    static {
        $.style(this, toCSS(this.tagname, {
            display: 'inline-flex',
            placeContent: 'center',
            placeItems: 'center',
            padding: `0 calc(var(--spacing) * 2.5)`,
            borderRadius: 'var(--radius)',
            height: 'calc(var(--spacing) * 8)',
            transition: '0.2s all ease',
            fontWeight: 'var(--font-weight-medium)',
            fontFamily: 'inherit',
            outline: '0.1rem solid oklch(from var(--border) l c h / 0)',
            userSelect: 'none',
            gap: 'calc(var(--spacing) * 2.5)',
            
            border: '1px solid oklch(from var(--input) l c h / .2)',
            background: 'oklch(from var(--input) l c h / .025)',
            color: 'oklch(from var(--fg) l c h / .9)',

            '&:focus-visible': {
                outline: '0.1rem solid var(--border)'
            },

            '&:active': {
                translate: '0 0.125rem'
            },

            '&:not([disabled]):hover': {
                background: 'oklch(from var(--input) l c h / .1)',
                color: 'oklch(from var(--fg) l c h / 1)',
            },

            '&[variant="primary"]': {
                border: 'none',
                color: 'oklch(from var(--primary-fg) l c h)',
                background: 'var(--primary-bg)'
            },

            '&[variant="secondary"]': {
                border: 'none',
                color: 'oklch(from var(--secondary-fg) l c h)',
                background: 'var(--secondary-bg)',
                '&:not([disabled]):hover': {
                    background: 'oklch(from var(--secondary-bg) l c h / .8)'
                }
            },

            '&[variant="destructive"]': {
                border: 'none',
                color: 'oklch(from var(--destructive-fg) l c h)',
                background: 'oklch(from var(--destructive-bg) l c h / .3)',
                '&:not([disabled]):hover': {
                    background: 'oklch(from var(--destructive-bg) l c h / .5)'
                }
            },

            '&[variant="ghost"]': {
                border: 'none',
                color: 'oklch(from var(--fg) l c h)',
                background: 'oklch(from var(--input) l c h / 0)',
                '&:not([disabled]):hover': {
                    background: 'oklch(from var(--input) l c h / .1)'
                }
            },

            '&[variant="link"]': {
                border: 'none',
                color: 'oklch(from var(--fg) l c h)',
                background: 'oklch(from var(--input) l c h / 0)',
                '&:not([disabled]):hover': {
                    textDecoration: 'underline',
                    textUnderlineOffset: '0.2rem'
                }
            },

            '&[size="icon"]': {
                width: 'calc(var(--spacing) * 8)',
                padding: '0'
            },

            '&[size="xs"]': {
                padding: 'calc(var(--spacing) * 2)',
                fontSize: 'var(--text_xs)',
                height: 'calc(var(--spacing) * 6)'
            },

            '&[size="icon-xs"]': {
                width: 'calc(var(--spacing) * 6)',
                height: 'calc(var(--spacing) * 6)',
                padding: '0',

                'svg': {
                    width: 'calc(var(--spacing) * 3)',
                    height: 'calc(var(--spacing) * 3)'
                }
            },

            '&[size="sm"]': {
                height: 'calc(var(--spacing) * 7)'
            },

            '&[size="icon-sm"]': {
                width: 'calc(var(--spacing) * 7)',
                height: 'calc(var(--spacing) * 7)',
                padding: '0',
            },

            '&[size="lg"]': {
                height: 'calc(var(--spacing) * 9)'
            },

            '&[size="icon-lg"]': {
                width: 'calc(var(--spacing) * 9)',
                height: 'calc(var(--spacing) * 9)',
                padding: '0',
            },

            '&[disabled]': {
                opacity: '.5'
            }
        }))
    }
}