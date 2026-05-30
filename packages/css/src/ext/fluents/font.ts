import '#ext/fluent';
import { colors } from "#ext/variables/colors";
import { text } from "#ext/variables/text";
import { weight } from "#ext/variables/weight";

export const font = $.css.fluent(f => f
    .prop('fontSize', {...text})
    .prop('color', {...colors})
    .prop('fontWeight', {...weight})
    .option('trim', { textBox: 'trim-both cap alphabetic' })
    .prop('textAlign', {
        left: 'left',
        right: 'right',
        center: 'center',
        start: 'start',
        end: 'end',
    })
)
