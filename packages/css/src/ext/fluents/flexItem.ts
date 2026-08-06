import { valueFn } from "#lib/valueFn";
import { Fluent } from '@amateras/fluent';

export const flexItem = new Fluent<$.CSSDeclarationMap>()
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
    .proxy()