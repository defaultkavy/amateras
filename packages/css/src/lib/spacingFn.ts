import { Utils } from "@amateras/utils";

export const spacingFn = (val: $.CSSValue) => Utils.isString(val) ? val : `calc(var(--spacing) * ${val})`;