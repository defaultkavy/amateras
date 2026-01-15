import { ElementProto } from "@amateras/core";
import { _instanceof } from "@amateras/utils";
import { Slideshow } from "./Slideshow";

$.style('slide{display:block;height:100%;width:100%;position:absolute}')

export class Slide extends ElementProto {
    constructor(props: $.Props, layout?: $.Layout<Slideshow>) {
        super('slide', props, layout);
    }

    override build() {
        if (!_instanceof(this.parent, Slideshow)) throw 'Slide must be inside Slideshow Element';
        this.parent.slides.add(this);
        return super.build();
    }
}
