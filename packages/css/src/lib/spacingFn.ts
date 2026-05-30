import { Utils } from "@amateras/utils";

export const spacingFn = (val: number | string) => Utils.isString(val) ? val : `calc(var(--spacing) * ${val})`;