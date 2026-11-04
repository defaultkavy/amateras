import '#ext/variable';

export const radius = $.css.variable({
    xs: 'calc(var(--radius) * 0.6)',
    sm: 'calc(var(--radius) * 0.8)',
    md: 'var(--radius)',
    lg: 'calc(var(--radius) * 1.2)',
    xl: 'calc(var(--radius) * 1.4)',
    xl2: 'calc(var(--radius) * 1.6)',
    xl3: 'calc(var(--radius) * 2.4)',
    xl4: 'calc(var(--radius) * 3.2)',
    full: 'calc(infinity * 1px)'
}, {
    prefix: 'radius-'
})