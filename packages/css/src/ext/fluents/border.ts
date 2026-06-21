import '#ext/fluent';
import { Utils } from "@amateras/utils";
import { radius } from "../variables/radius";
import { colors } from '#ext/variables';
import { valueFn } from '#lib/valueFn';

const borderRadiusTemplate = {
    xs: radius.xs,
    sm: radius.sm,
    md: radius.md,
    lg: radius.lg,
    xl: radius.xl,
    xl2: radius.xl2,
    none: 0,
    full: 'calc(infinity * 1px)'
}

const useBorderRadiusTemplate = <N extends string>(prefix: N) => Utils.fromEntries([...Utils.map(Utils.entries(borderRadiusTemplate), ([prop, value]) => [`${prefix}_${prop}`, value]), [prefix, (val: string) => val]]) as { [key in keyof (typeof borderRadiusTemplate) as `${N}_${key}`]: typeof borderRadiusTemplate[key] } & { [key in N]: (val: string) => string }
const useGroupBorderRadiusTemplate = <N extends string>(prefix: N, ...props: string[]) => Utils.fromEntries([...Utils.map(Utils.entries(borderRadiusTemplate), ([prop, value]) => [`${prefix}_${prop}`, Utils.fromEntries(Utils.map(props, prop => [prop, value]))]), [prefix, (val: string) => Utils.fromEntries(Utils.map(props, prop => [prop, val]))]]) as { [key in keyof (typeof borderRadiusTemplate) as `${N}_${key}`]: $.CSSDeclarationMap } & { [key in N]: (val: string) => $.CSSDeclarationMap }

export const border = $.css.fluent(f => f
    .prop('borderRadius', useBorderRadiusTemplate('rounded'))
    .prop('borderTopLeftRadius', useBorderRadiusTemplate('rounded_tl'))
    .prop('borderTopRightRadius', useBorderRadiusTemplate('rounded_tr'))
    .prop('borderBottomLeftRadius', useBorderRadiusTemplate('rounded_bl'))
    .prop('borderBottomRightRadius', useBorderRadiusTemplate('rounded_br'))
    .group('borderRadiusTop', useGroupBorderRadiusTemplate('rounded_t', 'borderTopLeftRadius', 'borderTopRightRadius'))
    .group('borderRadiusBottom', useGroupBorderRadiusTemplate('rounded_b', 'borderBottomLeftRadius', 'borderBottomRightRadius'))
    .group('borderRadiusLeft', useGroupBorderRadiusTemplate('rounded_l', 'borderTopLeftRadius', 'borderBottomLeftRadius'))
    .group('borderRadiusRight', useGroupBorderRadiusTemplate('rounded_r', 'borderTopRightRadius', 'borderBottomRightRadius'))

    .prop('borderWidth', {
        w: (val: string | number) => val
    })
    .prop('borderStyle', {
        solid: 'solid',
        dashed: 'dashed',
        hidden: 'hidden',
        dotted: 'dotted',
        double: 'double',
        groove: 'groove',
        ridge: 'ridge',
        inset: 'inset',
        outset: 'outset'
    })

    .prop('borderColor', {
        ...colors,
        color: valueFn
    })

)