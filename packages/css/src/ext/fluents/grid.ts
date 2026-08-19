import { spacingFn } from "#lib/spacingFn";
import { Fluent } from '@amateras/fluent';

export const grid = new Fluent<$.CSSDeclarationMap>()
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
    .prop('placeContent', {
        content_center: 'center',
        content_between: 'space-between',
        content_end: 'flex-end',
        content_start: 'flex-start'
    })
    .prop('placeItems', {
        items_center: 'center',
        items_between: 'space-between',
        items_end: 'end',
        items_start: 'start'
    })
    .proxy()