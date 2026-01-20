import { ElementProto } from "@amateras/core";
import { _null } from "@amateras/utils";
import { Slide } from "./Slide";

export interface SlideshowOptions {
    /**第一个播放的位置 */
    index?: number;
    /**Slide 间隔时间，单位为秒 */
    interval?: number;
    /**是否自动播放 */
    autoplay?: boolean;
    /**动画函数 */
    animation?: SlideshowAnimationHandle;
}

export class Slideshow extends ElementProto {
    declare __child__: Slide;
    slide: Slide | null = _null;
    index: number;
    timer: NodeJS.Timeout | null = _null;
    interval: number;
    autoplay: boolean;
    animation: SlideshowAnimationHandle | null;
    #passed = 0;
    constructor({index, interval, autoplay, animation, ...props}: $.Props<SlideshowOptions>, layout?: $.Layout<Slideshow>) {
        super('slideshow', props, layout);
        this.index = index ?? 0;
        this.interval = interval ?? 5;
        this.autoplay = autoplay ?? false;
        this.animation = animation ?? _null;
        this.disposers.add(() => this.pause());
        this.ondom(() => {
            if (this.autoplay) this.play();
        })
    }

    static {
        $.style(Slideshow, 'slideshow{display:block;position:relative;overflow:clip}')
    }

    override build(): this {
        super.build();
        this.switch(this.index);
        return this;
    }

    override toString(): string {
        return this.parseHTML({children: this.slide?.toString()});
    }

    override toDOM(children = true): HTMLElement[] {
        super.toDOM(false);
        if (children && this.slide) this.node?.append(...this.slide.toDOM());
        return [this.node!]
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
        let size = this.children.length;
        let nextIndex = this.index + 1;
        if (nextIndex >= size) nextIndex = 0;
        this.switch(nextIndex);
    }

    prev() {
        let size = this.children.length;
        let prevIndex = this.index - 1;
        if (prevIndex <= 0) prevIndex = size - 1;
        this.switch(prevIndex);
    }

    switch(index: number) {
        this.index = index;
        let slide = this.children.at(index);
        if (this.slide === slide) return;
        if (!slide) return;
        if (this.animation) this.animation(this, slide, this.slide);
        else {
            slide.parent = this;
            this.slide = slide;
            this.node?.replaceChildren(...slide.toDOM());
        }
    }
}

export type SlideshowAnimationHandle = (slideshow: Slideshow, newSlide: Slide, oldSlide: Slide | null) => void;