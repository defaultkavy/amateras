import { ElementProto } from "@amateras/core";

export class TextBlock extends ElementProto {
    constructor(props: $.Props, layout?: $.Layout<TextBlock>) {
        super('text-block', props, layout);
    }
    
    static {
        $.style(TextBlock, 'text-block{display:block}')
    }
}
