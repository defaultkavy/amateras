import '#ext/variable';

export const weight = $.css.variable({
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
}, {
    prefix: 'font-weight-'
})