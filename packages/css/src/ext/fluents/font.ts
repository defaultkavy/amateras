import { colors } from "#ext/variables/colors";
import { text } from "#ext/variables/text";
import { weight } from "#ext/variables/weight";
import { spacingFn } from '#lib/spacingFn';
import { valueFn } from '#lib/valueFn';
import { Fluent } from '@amateras/fluent';

export const font = new Fluent<$.CSSDeclarationMap>()
    .prop('fontSize', {...text})
    .prop('color', {
        ...colors,
        color: valueFn
    })
    .prop('fontWeight', {...weight})
    .option('trim', { textBox: 'trim-both cap alphabetic' })
    .prop('textAlign', {
        left: 'left',
        right: 'right',
        center: 'center',
        start: 'start',
        end: 'end',
    })
    .prop('fontFamily', {
        family: valueFn
    })
    .prop('lineHeight', {
        lineHeight: spacingFn
    })
    .proxy()