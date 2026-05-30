import '#ext/colors/zinc';
import '#ext/colors/cyan';
import '#ext/colors/red';

const lightDark = (light: $.CSSValue, dark: $.CSSValue) => `light-dark(${light}, ${dark})`;

const mainColor = $.color.zinc;
const accentColor = $.color.cyan;
const destructiveColor = $.color.red;

export const colors = $.css.variable({
    fg: lightDark(mainColor[600], mainColor[300]),
    bg: lightDark(mainColor[200], mainColor[800]),

    primaryFg: lightDark(mainColor[100], mainColor[900]),
    primaryBg: lightDark(mainColor[700], mainColor[100]),

    secondaryFg: lightDark(mainColor[900], mainColor[100]),
    secondaryBg: lightDark(mainColor[100], mainColor[900]),

    accentFg: lightDark(accentColor[500], accentColor[200]),
    accentBg: lightDark(accentColor[200], accentColor[700]),

    destructiveBg: lightDark(destructiveColor[300], destructiveColor[900]),
    destructiveFg: lightDark(destructiveColor[600], destructiveColor[400]),

    muted: lightDark(mainColor[500], mainColor[400]),
    border: lightDark(mainColor[400], mainColor[600]),
    input: lightDark(`oklch(from ${mainColor[900]} l c h / .15)`, `oklch(from ${mainColor[100]} l c h / .15)`),
})