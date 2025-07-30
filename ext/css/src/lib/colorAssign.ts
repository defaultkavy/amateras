import { _Object_assign } from "../../../../src/lib/native";

export const colorAssign = (key: string, colors: {[key: number]: string}) => {
    if (!$.color) _Object_assign($, {color: {}});
    _Object_assign($.color, {[key]: colors})
}