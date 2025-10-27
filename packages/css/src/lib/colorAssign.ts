import { _Object_assign } from "@amateras/utils";

export const colorAssign = (key: string, colors: {[key: number]: string}) => {
    if (!$.color) _Object_assign($, {color: {}});
    _Object_assign($.color, {[key]: colors})
}