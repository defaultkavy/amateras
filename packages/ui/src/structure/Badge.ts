import { toCSS } from "#lib/toCSS";
import { ElementProto } from "@amateras/core";

export interface BadgeProps {
    variant?: 'primary' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link' | string & {};
    size?: 'base' | 'icon' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg' | string & {}
}

export class Badge extends ElementProto<HTMLButtonElement> {
    static tagname = 'badge';
    constructor(props: $.Props<BadgeProps>, layout?: $.Layout<Badge>) {
        super(Badge.tagname, props, layout)
    }

    static {
        $.style(this, toCSS(this.tagname, {
            display: 'inline-flex',
            placeContent: 'center',
            placeItems: 'center',
            padding: `0 calc(var(--spacing) * 2)`,
            borderRadius: 'calc(var(--radius) * 2.6)',
            height: 'calc(var(--spacing) * 5)',
            transition: '0.2s all ease',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-weight-medium)',
            fontFamily: 'inherit',
            outline: '0.1rem solid oklch(from var(--border) l c h / 0)',
            whiteSpace: 'nowrap',
            gap: `var(--spacing)`,
            
            border: '1px solid oklch(from var(--input) l c h / .2)',
            background: 'oklch(from var(--input) l c h / .025)',
            color: 'oklch(from var(--fg) l c h / .9)',

            '&:focus-visible': {
                outline: '0.1rem solid var(--border)'
            },

            'a:not([disabled]) &:hover': {
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
                'a:not([disabled]) &:hover': {
                    background: 'oklch(from var(--secondary-bg) l c h / .8)'
                }
            },

            '&[variant="destructive"]': {
                border: 'none',
                color: 'oklch(from var(--destructive-fg) l c h)',
                background: 'oklch(from var(--destructive-bg) l c h / .3)',
                'a:not([disabled]) &:hover': {
                    background: 'oklch(from var(--destructive-bg) l c h / .5)'
                }
            },

            '&[variant="ghost"]': {
                border: 'none',
                color: 'oklch(from var(--fg) l c h)',
                background: 'oklch(from var(--input) l c h / 0)',
                'a:not([disabled]) &:hover': {
                    background: 'oklch(from var(--input) l c h / .1)'
                }
            },

            '&[variant="link"]': {
                border: 'none',
                color: 'oklch(from var(--fg) l c h)',
                background: 'oklch(from var(--input) l c h / 0)',
                'a:not([disabled]) &:hover': {
                    textDecoration: 'underline',
                    textUnderlineOffset: '0.2rem'
                }
            },

            'a[disabled] &': {
                opacity: '.5'
            }
        }))
    }
}