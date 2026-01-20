import { ElementProto } from "@amateras/core";
import { Slideshow } from "./Slideshow";

export class Slide extends ElementProto {
    constructor(props: $.Props, layout?: $.Layout<Slideshow>) {
        super('slide', props, layout);
    }
    
    static {
        $.style(Slide, 'slide{display:block;height:100%;width:100%;position:absolute}')
    }
}
