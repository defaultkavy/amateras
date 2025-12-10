import { chain } from "@amateras/core/lib/chain";
import { $HTMLElement } from "@amateras/core/node/$HTMLElement";

const CAROUSEL = 'carousel';
const CAROUSEL_ITEM = 'carousel-item';

export class Carousel extends $HTMLElement {
    constructor() {
        super(CAROUSEL);
    }

}

export class CarouselItem extends $HTMLElement {
    constructor() {
        super(CAROUSEL_ITEM)
    }
}

export type CarouselDirection = 'horizontal' | 'vertical';