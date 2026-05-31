import type { CSSMap } from "#lib/toCSS";

export const content_css = {
    position: 'absolute',
    maxHeight: '50dvh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    border: '1px solid var(--input)',
    background: 'oklch(from var(--bg) l c h)',
    padding: 'calc(var(--spacing) * 2) calc(var(--spacing) * 1.25)',
    borderRadius: 'var(--radius)',
    userSelect: 'none',

    scrollbarWidth: 'thin',
    scrollbarColor: 'var(--input) transparent',
} satisfies CSSMap