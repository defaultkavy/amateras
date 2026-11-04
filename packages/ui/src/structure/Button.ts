import { pointerHoverMediaQuery } from "#lib/hover";
import { toUICSS } from "#lib/toCSS";
import { ElementProto } from "@amateras/core";

export interface ButtonProps {
    variant?: OrSignal<'primary' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link' | string & {}>;
    size?: OrSignal<'base' | 'icon' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg' | 'custom' | string & {}>;
}

export class Button extends ElementProto<HTMLButtonElement> {
    static tagname = 'button';
    constructor(props: $.Props<ButtonProps, HTMLButtonElement>, layout?: $.Layout<Button>) {
        super('button', {ui: 'button', ...props}, layout)
    }

    static {
        $.style(this, toUICSS('button[ui="button"]', {
            display: 'inline-flex',
            placeContent: 'center',
            placeItems: 'center',
            padding: `0 calc(var(--spacing) * 2.5)`,
            borderRadius: 'var(--radius)',
            height: 'calc(var(--spacing) * 8)',
            lineHeight: '1em',
            transition: '0.2s all ease',
            fontWeight: 'var(--font-weight-medium)',
            fontFamily: 'inherit',
            outline: '0.1rem solid color-mix(in oklch, var(--border) 0%, transparent)',
            userSelect: 'none',
            gap: 'calc(var(--spacing) * 2.5)',
            
            border: '1px solid var(--input)',
            background: 'color-mix(in oklch, var(--input) 15%, transparent)',
            color: 'color-mix(in oklch, var(--fg) 90%, transparent)',

            '&:focus-visible': {
                outline: '0.1rem solid var(--border)'
            },

            '&:not([disabled]):active': {
                translate: '0 0.125rem'
            },

            [pointerHoverMediaQuery]: {
                '&:not([disabled]):hover': {
                    background: 'color-mix(in oklch, var(--input) 10%, transparent)',
                },
            },

            '&[variant="primary"]': {
                border: 'none',
                color: 'var(--primary-fg)',
                background: 'var(--primary-bg)',

                [pointerHoverMediaQuery]: {
                    '&:not([disabled]):hover': {
                        background: 'color-mix(in oklch, var(--primary-bg) 80%, transparent)',
                    }
                }
            },

            '&[variant="secondary"]': {
                border: 'none',
                color: 'var(--secondary-fg)',
                background: 'var(--secondary-bg)',

                [pointerHoverMediaQuery]: {
                    '&:not([disabled]):hover': {
                        background: 'color-mix(in oklch, var(--secondary-bg) 80%, transparent)'
                    }
                },
            },

            '&[variant="destructive"]': {
                border: 'none',
                color: 'var(--destructive-fg)',
                background: 'color-mix(in oklch, var(--destructive-bg) 30%, transparent)',

                [pointerHoverMediaQuery]: {
                    '&:not([disabled]):hover': {
                        background: 'color-mix(in oklch, var(--destructive-bg) 50%, transparent)'
                    }
                },
            },

            '&[variant="ghost"]': {
                border: 'none',
                color: 'var(--fg)',
                background: 'color-mix(in oklch, var(--input) 0%, transparent)',

                [pointerHoverMediaQuery]: {
                    '&:not([disabled]):hover': {
                        background: 'color-mix(in oklch, var(--input) 10%, transparent)'
                    }
                },
            },

            '&[variant="link"]': {
                border: 'none',
                color: 'var(--fg)',
                background: 'transparent',

                [pointerHoverMediaQuery]: {
                    '&:not([disabled]):hover': {
                        textDecoration: 'underline',
                        textUnderlineOffset: '0.2rem'
                    }
                },
            },

            '&[size="icon"]': {
                width: 'calc(var(--spacing) * 8)',
                padding: '0'
            },

            '&[size="xs"]': {
                padding: 'calc(var(--spacing) * 2)',
                fontSize: 'var(--text-xs)',
                lineHeight: 'var(--text-xs)',
                height: 'calc(var(--spacing) * 6)',
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

            '&[size="custom"]': {
                padding: `calc(var(--spacing) * 2)`,
                height: 'unset',
            },

            '&[disabled]': {
                opacity: '.5'
            }
        }))
    }

    variant(variant: ButtonProps['variant']) {
        this.props({variant})
    }

    size(size: ButtonProps['size']) {
        this.props({size})
    }
}