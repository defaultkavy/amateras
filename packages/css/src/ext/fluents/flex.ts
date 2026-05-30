import '#ext/fluent';
import { spacingFn } from "#lib/spacingFn";

export const flex = $.css.fluent(f => f
    .init({display: 'flex'})
    .prop('flexDirection', {
        row: 'row',
        column: 'column',
        row_reverse: 'row-reverse',
        column_reverse: 'column-reverse'
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
    .prop('flexWrap', {
        nowrap: 'nowrap',
        wrap: 'wrap',
        wrap_reverse: 'wrap-reverse'
    })
)