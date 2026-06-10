import { Utils } from "@amateras/utils";

export const spacingFn = (val: $.CSSValue) => Utils.isNumber(val) ? `calc(var(--spacing) * ${val})` : val;