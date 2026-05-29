import { toUICSS } from "#lib/toCSS";
import { ElementProto } from "@amateras/core";

export class Slide extends ElementProto {
    constructor(props: $.Props, layout?: $.Layout<Slide>) {
        super('slide', props, layout);
    }
    
    static {
        $.style(Slide, toUICSS('slide', {
            display: 'block',
            height: '100%',
            width: '100%',
            position: 'relative'
        }))
    }
}

declare global {
    interface GlobalEventHandlersEventMap {
        showslide: Event
    }
}