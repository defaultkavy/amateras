import type { CSSMap } from "../lib/toCSS";

export const item_css = {
    display: 'flex',
    gap: 'calc(var(--spacing) * 1.25)',
    boxSizing: 'border-box',
    padding: 'calc(var(--spacing) * 2) calc(var(--spacing) * 1.25)',
    borderRadius: 'var(--radius)',
    fontSize: '0.875rem',
    fontWeight: '500',
    lineHeight: '1',

    '&:hover, :not(:has(select-item:hover)) &[focus]': {
        background: 'oklch(from var(--input) l c h / .1)'
    },

    '&[focus]': {
        outline: 'none'
    }
} satisfies CSSMap;