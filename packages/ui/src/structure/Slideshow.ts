import { ElementProto } from "@amateras/core";
import { _Array_from, _null } from "@amateras/utils";
import type { Slide } from "./Slide";

$.style('slideshow{display:block;position:relative}')

export interface SlideshowOptions {
    /**第一个播放的位置 */
    index?: number;
    /**Slide 间隔时间，单位为秒 */
    interval?: number;
    /**是否自动播放 */
    autoplay?: boolean;
}

export class Slideshow extends ElementProto {
    slide: Slide | null = _null;
    slides = new Set<Slide>();
    declare protos: Set<Slide>;
    index: number;
    timer: NodeJS.Timeout | null = _null;
    interval: number;
    autoplay: boolean;
    #passed = 0;
    constructor({index, interval, autoplay, ...props}: $.Props<SlideshowOptions>, layout?: $.Layout<Slideshow>) {
        super('slideshow', props, layout);
        this.index = index ?? 0;
        this.interval = interval ?? 5;
        this.autoplay = autoplay ?? false;
        this.disposers.add(() => this.pause());
        this.dom(() => {
            if (this.autoplay) this.play();
        })
    }

    override build(): this {
        super.build().clear();
        this.switch(this.index);
        return this;
    }

    play() {
        this.timer = setInterval(() => {
            this.#passed++;
            if (this.#passed >= this.interval * 100) {
                this.next();
                this.#passed = 0;
            }
        }, 10);
    }

    pause() {
        if (this.timer) clearTimeout(this.timer);
    }

    next() {
        let size = this.slides.size;
        let nextIndex = this.index + 1;
        if (nextIndex >= size) nextIndex = 0;
        this.switch(nextIndex);
    }

    prev() {
        let size = this.slides.size;
        let prevIndex = this.index - 1;
        if (prevIndex <= 0) prevIndex = size - 1;
        this.switch(prevIndex);
    }

    switch(index: number) {
        this.index = index;
        let slide = this.getSlides().at(index);
        if (!slide) throw 'Slideshow error: slide not found';
        if (this.slide) this.animate(slide, this.slide);
        else {
            slide.parent = this;
            this.slide = slide;
        }
    }

    getSlides() {
        return _Array_from(this.slides);
    }

    animate(newSlide: Slide, oldSlide: Slide | null) {
        this.slide = newSlide;
        let newNodes = newSlide.toDOM();
        this.node?.append(...newNodes);
        newSlide.node?.animate({
            translate: ['100% 0', '0 0']
        }, {
            duration: 500,
            easing: 'ease'
        })
        const animation = oldSlide?.node?.animate({
            translate: ['0 0', '-100% 0']
        },{
            duration: 500,
            easing: 'ease'
        })

        if (animation) animation.onfinish = () => oldSlide?.node?.remove();
    }
}