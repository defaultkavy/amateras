import '#ext/variable';

export const radius = $.css.variable({
    xs: 'calc(var(--radius) * 0.6)',
    sm: 'calc(var(--radius) * 0.8)',
    md: 'var(--radius)',
    lg: 'calc(var(--radius) * 1.2)',
    xl: 'calc(var(--radius) * 1.4)',
    xl2: 'calc(var(--radius) * 1.6)',
    round: '50%'
}, {
    prefix: 'radius-'
})