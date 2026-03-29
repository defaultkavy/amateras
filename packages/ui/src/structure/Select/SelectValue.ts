import { ElementProto } from "@amateras/core";
import type { Select } from "./Select";

export class SelectValue extends ElementProto {
    constructor(props: $.Props, layout?: $.Layout<Select>) {
        super('selector-value', props, layout);
    }
}