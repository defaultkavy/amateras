import {
    zinc as mainColor,
    cyan as accentColor,
    red as destructiveColor
} from "#ext/static-colors";

const lightDark = (light: $.CSSValue, dark: $.CSSValue) => `light-dark(${light}, ${dark})`;

export const colors = $.css.variable({
    fg: lightDark(mainColor.c600, mainColor.c300),
    bg: lightDark(mainColor.c200, mainColor.c800),

    primaryFg: lightDark(mainColor.c100, mainColor.c900),
    primaryBg: lightDark(mainColor.c700, mainColor.c100),

    secondaryFg: lightDark(mainColor.c900, mainColor.c100),
    secondaryBg: lightDark(mainColor.c100, mainColor.c900),

    accentFg: lightDark(accentColor.c500, accentColor.c200),
    accentBg: lightDark(accentColor.c200, accentColor.c700),

    destructiveBg: lightDark(destructiveColor.c300, destructiveColor.c900),
    destructiveFg: lightDark(destructiveColor.c600, destructiveColor.c400),

    muted: lightDark(mainColor.c500, mainColor.c400),
    border: lightDark(mainColor.c400, mainColor.c600),
    input: lightDark(`oklch(from ${mainColor.c900} l c h / .15)`, `oklch(from ${mainColor.c100} l c h / .15)`),
})