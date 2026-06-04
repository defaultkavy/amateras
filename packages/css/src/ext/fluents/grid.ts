import '#ext/fluent';
import { spacingFn } from "#lib/spacingFn";

export const grid = $.css.fluent(f => f
    .init({display: 'grid'})
    .prop('gridTemplateColumns', {
        cols: (val: $.CSSValue, n: $.CSSValue = 1) => `repeat(${n}, ${val})`
    })
    .prop('gridTemplateRows', {
        rows: (val: $.CSSValue, n: $.CSSValue = 1) => `repeat(${n}, ${val})`
    })
    .prop('gap', {
        gap: spacingFn
    })
)
