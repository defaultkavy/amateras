import '#ext/fluent';
import { colors } from "#ext/variables/colors";
import { spacingFn } from "#lib/spacingFn";

export const box = $.css.fluent(f => f
    .prop('paddingInline', {
        px: spacingFn
    })
    .prop('paddingBlock', {
        py: spacingFn
    })
    .prop('padding', {
        p: spacingFn
    })
    .prop('paddingTop', {
        pt: spacingFn
    })
    .prop('paddingLeft', {
        pl: spacingFn
    })
    .prop('paddingRight', {
        pr: spacingFn
    })
    .prop('paddingBottom', {
        pb: spacingFn
    })
    .prop('width', {
        w_full: '100%',
        w_min: 'min-content',
        w_max: 'max-content',
        w_fit: 'fit-content',
        w: spacingFn
    })
    .prop('height', {
        h_full: '100%',
        h_min: 'min-content',
        h_max: 'max-content',
        h_fit: 'fit-content',
        h: spacingFn
    })
    .prop('maxWidth', {
        maxw_full: '100%',
        maxw_min: 'min-content',
        maxw_max: 'max-content',
        maxw_fit: 'fit-content',
        maxw: spacingFn
    })
    .prop('height', {
        maxh_full: '100%',
        maxh_min: 'min-content',
        maxh_max: 'max-content',
        maxh_fit: 'fit-content',
        maxh: spacingFn
    })
    .prop('marginInline', {
        mx: spacingFn
    })
    .prop('marginBlock', {
        my: spacingFn
    })
    .prop('marginTop', {
        mt: spacingFn
    })
    .prop('marginLeft', {
        ml: spacingFn
    })
    .prop('marginRight', {
        mr: spacingFn
    })
    .prop('marginBottom', {
        mb: spacingFn
    })
    .prop('backgroundColor', {
        primary: colors.primaryBg,
        secondary: colors.secondaryBg,
        muted: colors.muted,
        accent: colors.accentBg,
        destructive: colors.destructiveBg,
        bg: (val: string) => val
    })
    .prop('display', {
        block: 'block',
        inline: 'inline',
        contents: 'contents',
        inline_block: 'inline-block',
    })
    .prop('overflow', {
        overflow_hidden: 'hidden',
        overflow_visible: 'visible',
        overflow_scroll: 'scroll',
        overflow_auto: 'auto'
    })
    .prop('overflowY', {
        overflow_y_hidden: 'hidden',
        overflow_y_visible: 'visible',
        overflow_y_scroll: 'scroll',
        overflow_y_auto: 'auto'
    })
    .prop('overflowX', {
        overflow_x_hidden: 'hidden',
        overflow_x_visible: 'visible',
        overflow_x_scroll: 'scroll',
        overflow_x_auto: 'auto'
    })
    .prop('placeSelf', {
        center: 'center',
        auto: 'auto',
        end: 'end',
        start: 'start',
        left: 'left',
        right: 'right'
    })
    .option('size', (val: number | string) => ({ height: spacingFn(val), width: spacingFn(val) }))
)