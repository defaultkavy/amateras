import '#ext/variable';

export const lineHeight = $.css.variable({
    xs: 'calc(1 / var(--text-xs))',
    sm: 'calc(1.25 / var(--text-sm))',
    base: 'calc(1.5 / var(--text-md))',
    lg: 'calc(1.75 / var(--text-lg))',
    xl: 'calc(1.75 / var(--text-xl))',
    xl2: 'calc(2 / var(--text-xl2))',
    xl3: 'calc(2.25 / var(--text-xl3))',
    xl4: 'calc(2.5 / var(--text-xl4))',
}, {
    prefix: 'line-height-'
})