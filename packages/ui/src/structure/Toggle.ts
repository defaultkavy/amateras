import { pointerHoverMediaQuery } from "#lib/hover";
import { toCSS } from "#lib/toCSS";
import { ElementProto } from "@amateras/core";
import { _null, isNull, isUndefined } from "@amateras/utils";

export interface ToggleProps {
    checked?: OrSignal<boolean>;
    variant?: OrSignal<'primary' | 'outline' | 'secondary' | 'ghost' | 'destructive' | string & {}>;
    size?: OrSignal<'base' | 'icon' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg' | string & {}>;
}

export class Toggle extends ElementProto<HTMLButtonElement> {
    static tagname = 'button';
    constructor(props: $.Props<ToggleProps, HTMLButtonElement>, layout?: $.Layout<Toggle>) {
        super('button', { ui: 'toggle', ...props}, layout);

        this.on('click', $$ => this.checked(!this.checked()))
    }

    static {
        $.style(this, toCSS('button[ui="toggle"]', {
            display: 'inline-flex',
            placeContent: 'center',
            placeItems: 'center',
            padding: `0 calc(var(--spacing) * 2.5)`,
            borderRadius: 'var(--radius)',
            height: 'calc(var(--spacing) * 8)',
            lineHeight: '1rem',
            transition: '0.1s all ease',
            fontWeight: 'var(--font-weight-medium)',
            fontFamily: 'inherit',
            outline: '0.1rem solid oklch(from var(--border) l c h / 0)',
            userSelect: 'none',
            gap: 'calc(var(--spacing) * 2.5)',
            flexShrink: '0',
            
            border: '1px solid oklch(from var(--input) l c h / .2)',
            background: 'oklch(from var(--input) l c h / .025)',
            color: 'oklch(from var(--fg) l c h / .8)',

            [pointerHoverMediaQuery]: {
                '&:not([disabled]):hover': {
                    background: 'oklch(from var(--input) l c h / .1)',
                    color: 'oklch(from var(--fg) l c h)',
                },
            },

            '&[checked]': {
                color: 'oklch(from var(--primary-fg) l c h)',
                background: 'oklch(from var(--primary-bg) l c h / .8)',

                [pointerHoverMediaQuery]: {
                    '&:not([disabled]):hover': {
                        background: 'oklch(from var(--primary-bg) l c h)',
                        color: 'oklch(from var(--primary-fg) l c h)',
                    },
                },
            },

            '&[variant="primary"]': {
                '&[checked]': {
                    color: 'oklch(from var(--primary-fg) l c h)',
                    background: 'var(--primary-bg)',
                }
            },

            '&[variant="secondary"]': {
                '&[checked]': {
                    color: 'oklch(from var(--secondary-fg) l c h)',
                    background: 'var(--secondary-bg)',
                }
            },

            '&[variant="destructive"]': {
                '&[checked]': {
                    color: 'oklch(from var(--destructive-fg) l c h)',
                    background: 'oklch(from var(--destructive-bg) l c h / .3)',
                }
            },

            '&[variant="ghost"]': {
                border: 'none',
                color: 'oklch(from var(--fg) l c h)',
                background: 'oklch(from var(--input) l c h / 0)',
                '&[checked]': {
                    color: 'oklch(from var(--secondary-fg) l c h)',
                    background: 'var(--secondary-bg)',
                }
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

            '&[disabled]': {
                opacity: '.5'
            }
        }))
    }

    override props({ checked, ...props }: $.Props<ToggleProps>): void {
        super.props(props)
        this.checked(checked);
    }

    checked(): boolean;
    checked(bool?: OrSignal<boolean>): void;
    checked(bool?: OrSignal<boolean>) {
        if (!arguments.length) return !isNull(this.attr('checked'));
        if (isUndefined(bool)) return;
        $.resolve(bool, bool => {
            this.attr('checked', bool ? '' : _null);
            this.node?.dispatchEvent(new Event('input'))
        })
    }
}