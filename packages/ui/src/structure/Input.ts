import { input_css } from "../style/input_style";
import { toUICSS } from "#lib/toCSS";
import { ElementProto } from "@amateras/core";

export class Input extends ElementProto<HTMLInputElement> {
    static tagname = 'input';
    constructor(props: $.Props<{}, HTMLInputElement>, layout?: $.Layout<Input>) {
        super(Input.tagname, {ui: 'input', ...props}, layout)
    }

    static {
        $.style(this, toUICSS('input[ui="input"]', {
            ...input_css
        }))
    }
}