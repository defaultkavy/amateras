import { ElementProto } from "@amateras/core";

export class Slide extends ElementProto {
    constructor(props: $.Props, layout?: $.Layout<Slide>) {
        super('slide', props, layout);
    }
    
    static {
        $.style(Slide, 'slide{display:block;height:100%;width:100%;position:absolute}')
    }
}
