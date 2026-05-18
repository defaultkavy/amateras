import type { CSSMap } from "../lib/toCSS";

export const input_css = {
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
} satisfies CSSMap