import '#ext/fluent';
import { Utils } from "@amateras/utils";

export const hover = (map: OrArray<$.CSSDeclarationMap>) => ({
    '@media (hover: hover)': {
        '&:hover': Utils.merge(...Utils.toArray(map))
    }
})