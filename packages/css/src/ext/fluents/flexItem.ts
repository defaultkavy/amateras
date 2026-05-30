import '#ext/fluent';
import { valueFn } from "#lib/valueFn";

export const flexItem = $.css.fluent(f => f
    .prop('flexGrow', {
        grow: valueFn
    })
    .prop('flexBasic', {
        basic: valueFn
    })
    .prop('flexShrink', {
        shrink: valueFn
    })
    .prop('flex', {
        initial: '0 auto',
        auto: 'auto',
        none: 'none',
        flex: valueFn
    })
)