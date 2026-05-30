import '#ext/fluent';
import { Utils } from "@amateras/utils";

const mediaFn = (condition: string) => (map: OrArray<$.CSSDeclarationMap>) => ({ [`@media ${condition}`]: Utils.merge(...Utils.toArray(map)) });

export const media = {
    sm: mediaFn('(width < 40rem)'),
    md: mediaFn('(width < 48rem)'),
    lg: mediaFn('(width < 64rem)'),
    xl: mediaFn('(width < 80rem)'),
    xl2: mediaFn('(width < 96rem)')
}