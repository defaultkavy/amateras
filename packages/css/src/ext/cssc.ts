import { Utils } from '@amateras/utils';
import { Fluent } from "@amateras/fluent";
import { radius } from "#ext/variables/radius";
import { text } from "#ext/variables/text";
import { weight } from "#ext/variables/weight";
import { colors } from "#ext/variables/colors";
import { type $CSSRule } from "#structure/$CSSRule";

const spacingFn = (val: $.CSSValue) => Utils.isNumber(val) ? `calc(var(--spacing) * ${val})` : val;
const valueFn = <T extends any = $.CSSValue>(val: T) => val;

const dimensionBuild = <P extends string>(prefix: P) => Utils.prefixKeys(`${prefix}_`, {
    full: '100%',
    min: 'min-content',
    max: 'max-content',
    fit: 'fit-content',
    auto: 'auto',
    _: spacingFn
} as const)
const overflowBuild = <P extends string>(prefix: P) => Utils.prefixKeys(`${prefix}_`, {
    hidden: 'hidden',
    visible: 'visible',
    scroll: 'scroll',
    auto: 'auto'
} as const)
const lineStyleBuild = <P extends string>(prefix: P) => Utils.prefixKeys(`${prefix}_`, {
    solid: 'solid',
    dashed: 'dashed',
    hidden: 'hidden',
    dotted: 'dotted',
    double: 'double',
    groove: 'groove',
    ridge: 'ridge',
    inset: 'inset',
    outset: 'outset'
} as const)
const lineWidthBuild = <P extends string>(prefix: P) => Utils.prefixKeys(`${prefix}_`, {
    thin: 'thin',
    medium: 'medium',
    thick: 'thick',
    width: spacingFn
} as const)
const timingFunctionBuild = <P extends string>(prefix: P) => Utils.prefixKeys(`${prefix}_`, {
    ease: 'ease',
    ease_in: 'ease-in',
    ease_out: 'ease-out',
    ease_in_out: 'ease-in-out',
    linear: 'linear',
    step_start: 'step-start',
    step_end: 'step-end'
} as const)

const dimensionValue = <V extends $.CSSValue>(value: V) => ({ width: value, height: value })
const useBorderRadiusTemplate = <N extends string>(prefix: N) => Utils.fromEntries([...Utils.map(Utils.entries(radius), ([prop, value]) => [`${prefix}_${prop}`, value]), [prefix, (val: string) => val]]) as { [key in keyof (typeof radius) as `${N}_${key}`]: typeof radius[key] } & { [key in N]: (val: string) => string }
const useGroupBorderRadiusTemplate = <N extends string>(prefix: N, ...props: string[]) => 
    Utils.fromEntries([
        ...Utils.map(Utils.entries(radius), ([prop, value]) => 
                [`${prefix}_${prop}`, Utils.fromEntries(Utils.map(props, prop => [prop, value]))]), [prefix, (val: string) => Utils.fromEntries(Utils.map(props, prop => [prop, val]))]]) as { [key in keyof (typeof radius) as `${N}_${key}`]: $.CSSDeclarationMap } & { [key in N]: (val: string) => $.CSSDeclarationMap }

const mediaFn = (condition: string) => (map: OrMatrix<$.CSSMap | $CSSRule>) => ({ [`@media ${condition}`]: map });

export const _cssc = new Fluent<$.CSSDeclarationMap>()
.map({
    display: Fluent.values({
        block: 'block',
        inline: 'inline',
        flex: 'flex',
        grid: 'grid',
        table: 'table',
        contents: 'contents',
        inline_block: 'inline-block',
        none: 'none'
    }),

    position: Fluent.values({
        absolute: 'absolute',
        static: 'static',
        sticky: 'sticky',
        relative: 'relative',
        fixed: 'fixed'
    }),

    padding: Fluent.values({ p: spacingFn }),
    paddingInline: Fluent.values({ px: spacingFn }),
    paddingBlock: Fluent.values({ py: spacingFn }),
    paddingTop: Fluent.values({ pt: spacingFn }),
    paddingLeft: Fluent.values({ pl: spacingFn }),
    paddingRight: Fluent.values({ pr: spacingFn }),
    paddingBottom: Fluent.values({ pb: spacingFn }),
    
    margin: Fluent.values({ m: spacingFn }),
    marginInline: Fluent.values({ mx: spacingFn }),
    marginBlock: Fluent.values({ my: spacingFn }),
    marginTop: Fluent.values({ mt: spacingFn }),
    marginLeft: Fluent.values({ ml: spacingFn }),
    marginRight: Fluent.values({ mr: spacingFn }),
    marginBottom: Fluent.values({ mb: spacingFn }),

    width: Fluent.values(dimensionBuild('w')),
    height: Fluent.values(dimensionBuild('h')),
    minWidth: Fluent.values(dimensionBuild('minw')),
    maxWidth: Fluent.values(dimensionBuild('maxw')),
    minHeight: Fluent.values(dimensionBuild('minh')),
    maxHeight: Fluent.values(dimensionBuild('maxh')),
    dimensions: Fluent.group({
        d_full: dimensionValue('100%'),
        d_max: dimensionValue('max-content'),
        d_min: dimensionValue('min-content'),
        d_fit: dimensionValue('fit-content'),
        d: (value: $.CSSValue) => dimensionValue(value)
    }),

    overflow: Fluent.values(overflowBuild('overflow')),
    overflowX: Fluent.values(overflowBuild('overflow_x')),
    overflowY: Fluent.values(overflowBuild('overflow_y')),

    top: Fluent.values({ top: spacingFn }),
    bottom: Fluent.values({ bottom: spacingFn }),
    left: Fluent.values({ left: spacingFn }),
    right: Fluent.values({ right: spacingFn }),
    inset: Fluent.values({ inset: spacingFn }),

    zIndex: Fluent.values({ z: valueFn }),

    placeItems: Fluent.group({
        items_center: { alignItems: 'center', justifyItems: 'center' },
        items_between: { alignItems: 'space-between', justifyItems: 'space-between' },
        items_start: { alignItems: 'start', justifyItems: 'start' },
        items_end: { alignItems: 'end', justifyItems: 'end' },
        align_items: (val: $.CSSDeclarationMap['alignItems']) => ({ alignItems: val }),
        justify_items: (val: $.CSSDeclarationMap['justifyItems']) => ({ justifyItems: val }),
        place_items: (val: $.CSSDeclarationMap['placeItems']) => ({ placeItems: val }),
    }),
    placeContent: Fluent.group({
        content_center: { alignContent: 'center', justifyContent: 'center' },
        content_between: { alignContent: 'space-between', justifyContent: 'space-between' },
        content_start: { alignContent: 'start', justifyContent: 'start' },
        content_end: { alignContent: 'end', justifyContent: 'end' },
        align_content: (val: $.CSSDeclarationMap['alignContent']) => ({ alignContent: val }),
        justify_content: (val: $.CSSDeclarationMap['justifyContent']) => ({ justifyContent: val }),
        place_content: (val: $.CSSDeclarationMap['placeContent']) => ({ placeContent: val }),
    }),
    placeSelf: Fluent.group({
        self_center: { alignSelf: 'center', justifySelf: 'center' },
        self_start: { alignSelf: 'start', justifySelf: 'start' },
        self_end: { alignSelf: 'end', justifySelf: 'end' },
        align_self: (val: $.CSSDeclarationMap['alignSelf']) => ({ alignSelf: val }),
        justify_self: (val: $.CSSDeclarationMap['justifySelf']) => ({ justifySelf: val }),
        place_self: (val: $.CSSDeclarationMap['placeSelf']) => ({ placeSelf: val }),
    }),

    objectFit: Fluent.values({
        cover: 'cover',
        contain: 'contain',
        fill: 'fill',
        scaleDown: 'scale-down',
        fit: valueFn<$.CSSDeclarationMap['objectFit']>
    }),
    objectPosition: Fluent.values({ position: valueFn }),

    aspectRatio: Fluent.values({
        ratio: valueFn,
        ratio_square: '1 / 1',
        ratio_16_9: '16 / 9',
        ratio_4_3: '4 / 3'
    }),

    translate: Fluent.values({ translate: valueFn }),
    scale: Fluent.values({ scale: valueFn }),
    rotate: Fluent.values({ rotate: valueFn }),
    transformOrigin: Fluent.values({ origin: valueFn<$.CSSDeclarationMap['transformOrigin']> }),
    
    opacity: Fluent.values({ opacity: valueFn<$.CSSDeclarationMap['opacity']> }),

    transition: Fluent.values({ transition: valueFn<$.CSSDeclarationMap['transition']> }),
    transitionDuration: Fluent.values({ t_duration: valueFn<$.CSSDeclarationMap['transitionDuration']> }),
    transitionProperty: Fluent.values({ t_property: valueFn<$.CSSDeclarationMap['transitionProperty']> }),
    transitionDelay: Fluent.values({ t_delay: valueFn<$.CSSDeclarationMap['transitionDelay']> }),
    transitionTimingFunction: Fluent.values(timingFunctionBuild('t')),

    cursor: valueFn<$.CSSDeclarationMap['cursor']>,
    pointerEvent: Fluent.values({
        pointer_none: 'none',
        pointer_auto: 'auto',
        pointer: valueFn<$.CSSDeclarationMap['pointerEvents']>
    }),
    userSelect: Fluent.values({
        select_none: 'none',
        select_auto: 'auto',
        select_text: 'text',
        select_all: 'all'
    }),

    boxSizing: Fluent.values({
        borderBox: 'border-box',
        contentBox: 'content-box'
    }),

    flexDirection: Fluent.values({
        row: 'row',
        column: 'column',
        row_reverse: 'row-reverse',
        column_reverse: 'column-reverse'
    }),
    flexWrap: Fluent.values({
        nowrap: 'nowrap',
        wrap: 'wrap',
        wrap_reverse: 'wrap-reverse'
    }),
    flexShrink: Fluent.values({ shrink: valueFn<$.CSSDeclarationMap['flexShrink']> }),
    flexGrow: Fluent.values({ grow: valueFn<$.CSSDeclarationMap['flexGrow']> }),
    flexFlow: Fluent.values({ flow: valueFn<$.CSSDeclarationMap['flexFlow']> }),
    flexBasis: Fluent.values({ basis: valueFn<$.CSSDeclarationMap['flexBasis']> }),

    gridTemplateColumns: Fluent.values({ 
        cols: valueFn,
        cols_repeat: (val: $.CSSValue, n: $.CSSValue = 1) => `repeat(${n}, ${val})`
    }),
    gridTemplateRows: Fluent.values({
        rows: valueFn,
        rows_repeat: (val: $.CSSValue, n: $.CSSValue = 1) => `repeat(${n}, ${val})`
    }),
    gap: Fluent.values({ gap: spacingFn }),
    rowGap: Fluent.values({ row_gap: spacingFn }),
    columnGap: Fluent.values({ col_gap: spacingFn }),

    borderRadius: Fluent.values(useBorderRadiusTemplate('rounded')),
    borderTopLeftRadius: Fluent.values(useBorderRadiusTemplate('rounded_tl')),
    borderTopRightRadius: Fluent.values(useBorderRadiusTemplate('rounded_tr')),
    borderBottomLeftRadius: Fluent.values(useBorderRadiusTemplate('rounded_bl')),
    borderBottomRightRadius: Fluent.values(useBorderRadiusTemplate('rounded_br')),
    borderTopRadius: Fluent.group(useGroupBorderRadiusTemplate('rounded_t', 'borderTopLeftRadius', 'borderTopRightRadius')),
    borderBottomRadius: Fluent.group(useGroupBorderRadiusTemplate('rounded_t', 'borderBottomLeftRadius', 'borderBottomRightRadius')),
    borderLeftRadius: Fluent.group(useGroupBorderRadiusTemplate('rounded_t', 'borderTopLeftRadius', 'borderBottomLeftRadius')),
    borderRightRadius: Fluent.group(useGroupBorderRadiusTemplate('rounded_t', 'borderTopRightRadius', 'borderBottomRightRadius')),

    borderStyle: Fluent.values(lineStyleBuild('b')),
    borderSpacing: Fluent.values({ b_spacing: spacingFn }),
    borderColor: Fluent.values({ b_color: valueFn<$.CSSDeclarationMap['borderColor']> }),
    borderWidth: Fluent.values(lineWidthBuild('b')),

    outlineStyle: Fluent.values(Fluent.values(lineStyleBuild('o'))),
    outlineOffset: Fluent.values({ o_spacing: spacingFn }),
    outlineColor: Fluent.values({ o_color: valueFn<$.CSSDeclarationMap['outlineColor']> }),
    outlineWidth: Fluent.values(lineWidthBuild('o')),

    fontSize: Fluent.values({ 
        ...Utils.prefixKeys('text', text),
        text: valueFn<$.CSSDeclarationMap['fontSize']>
    }),
    fontFamily: Fluent.values({ font: valueFn }),
    fontWeight: Fluent.values({
        ...Utils.prefixKeys('text', weight),
        weight: valueFn<$.CSSDeclarationMap['fontWeight']>
    }),
    color: Fluent.values({
        ...Utils.prefixKeys('text', colors),
        color: valueFn
    }),

    textAlign: Fluent.values({
        text_left: 'left',
        text_right: 'right',
        text_center: 'center',
        text_start: 'start',
        text_end: 'end'
    }),
    textBox: Fluent.values({
        trim_auto: 'trim-both cap alphabetic',
        textbox: valueFn<$.CSSDeclarationMap['textBox']>
    }),
    letterSpacing: Fluent.values({
        tracking_tighter: '-0.05em',
        tracking_tight: '-0.025em',
        tracking_normal: '0',
        tracking_wide: '.025em',
        tracking_wider: '.05em',
        tracking_widest: '.1em',
        tracking: valueFn<$.CSSDeclarationMap['letterSpacing']>
    }),

    lineHeight: Fluent.values({ line_height: spacingFn }),

    background: Fluent.values({ bg: valueFn<$.CSSDeclarationMap['background']> }),
    backgroundColor: Fluent.values({ ...Utils.prefixKeys('bg', colors) }),
    backgroundImage: Fluent.values({ bg_img: valueFn<$.CSSDeclarationMap['backgroundImage']> }),
    backgroundAttachment: Fluent.values({ bg_attachment: valueFn<$.CSSDeclarationMap['backgroundAttachment']> }),
    backgroundBlendMode: Fluent.values({ bg_blend: valueFn<$.CSSDeclarationMap['backgroundBlendMode']> }),
    backgroundClip: Fluent.values({ bg_clip: valueFn<$.CSSDeclarationMap['backgroundClip']> }),
    backgroundOrigin: Fluent.values({ bg_origin: valueFn<$.CSSDeclarationMap['backgroundOrigin']> }),
    backgroundRepeat: Fluent.values({ bg_repeat: valueFn<$.CSSDeclarationMap['backgroundRepeat']> }),
    backgroundSize: Fluent.values({ 
        bg_auto: 'auto',
        bg_cover: 'cover',
        bg_contain: 'contain'    
    }),

    scrollbarWidth: Fluent.values({ scrollbar_w: valueFn<$.CSSDeclarationMap['scrollbarWidth']> }),

    boxShadow: Fluent.values({ shadow: valueFn<$.CSSDeclarationMap['boxShadow']> }),
    filter: valueFn<$.CSSDeclarationMap['filter']>,

    animation: Fluent.values({
        animation: valueFn<$.CSSDeclarationMap['animation']>
    }),
    animationDuration: Fluent.values({
        a_duration: valueFn<$.CSSDeclarationMap['animationDuration']>
    }),
    animationIterationCount: Fluent.values({
        a_infinite: 'infinite',
        a_iteration: valueFn<$.CSSDeclarationMap['animationIterationCount']>
    }),
    animationComposition: Fluent.values({
        a_replace: 'replace',
        a_add: 'add',
        a_accumulate: 'accumulate'
    }),
    animationDelay: Fluent.values({
        a_delay: valueFn<$.CSSDeclarationMap['animationDelay']>
    }),
    animationFillMode: Fluent.values({
        a_none: 'none',
        a_forwards: 'forwards',
        a_backwards: 'backwards',
        a_both: 'both'
    }),
    animationPlayState: Fluent.values({
        a_running: 'running',
        a_paused: 'paused'
    }),
    animationTimingFunction: Fluent.values(timingFunctionBuild('a')),

    insert: Fluent.method((map: OrMatrix<$.CSSMap>) => map),
    hover: (map: OrMatrix<$.CSSMap | $CSSRule>) => ({'html:not([touch]) &:hover': map}),
    media_sm: mediaFn('(width < 40rem)'),
    media_md: mediaFn('(width < 48rem)'),
    media_lg: mediaFn('(width < 64rem)'),
    media_xl: mediaFn('(width < 80rem)'),
    media_xl2: mediaFn('(width < 96rem)'),
    media: Fluent.method((condition: string, map: OrMatrix<$.CSSMap | $CSSRule>) => mediaFn(condition)(map))
})
.proxy()

declare global {
    export namespace $ {
        export const cssc: typeof _cssc;
    }
}

Utils.assign($, {
    cssc: _cssc,
})