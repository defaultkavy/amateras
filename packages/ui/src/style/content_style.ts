import type { CSSMap } from "#lib/toCSS";

export const content_css: CSSMap = {
    position: 'absolute',
    top: '0',
    left: '0',
    maxHeight: '50dvh',
    overflowY: 'auto',
    display: 'block',
    boxSizing: 'border-box',
    border: '1px solid var(--input)',
    background: 'oklch(from var(--bg) l c h)',
    padding: 'calc(var(--spacing) * 2) calc(var(--spacing) * 1.25)',
    borderRadius: 'var(--radius)',
    userSelect: 'none',

    scrollbarWidth: 'thin',
    scrollbarColor: 'var(--input) transparent',
}