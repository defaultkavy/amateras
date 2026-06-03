import '#ext/fluent';
import { Utils } from "@amateras/utils";

export const hover = (map: OrArray<$.CSSMap>) => ({
    'html:not([touch]) &:hover': Utils.merge(...Utils.toArray(map))
})