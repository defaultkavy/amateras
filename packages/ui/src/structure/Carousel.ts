import { toUICSS } from "#lib/toCSS";
import { ElementProto } from "@amateras/core";
import { Utils } from "@amateras/utils";
import { Button, type ButtonProps } from "./Button";
import { parseMatrix2D } from "#lib/matrix";

export interface CarouselProps {
    autoplay?: OrSignal<boolean>;
    loop?: OrSignal<boolean>;
    gap?: OrSignal<string>;
    hoverpause?: OrSignal<boolean>;
    interval?: OrSignal<number>;
}

export class Carousel extends ElementProto {
    static tagname = 'carousel';
    $content: CarouselContent | null = Utils.Null;
    $container: CarouselContainer | null = Utils.Null;
    index = 0;
    itemList = new Set<CarouselItem>();
    timer: NodeJS.Timeout | null = Utils.Null;
    #interval = 3;
    #passed = 0;
    playing = false;
    transformIndex = 0;
    private animation: Animation | null = Utils.Null;
    #observer: ResizeObserver | null = Utils.Null;
    $targetItem: CarouselItem | null = Utils.Null;
    constructor(props: $.Props<CarouselProps>, layout?: $.Layout<Carousel>) {
        super(Carousel.tagname, props, layout);
        this.on('mouseenter', e => this.hasAttr('hoverpause') && this.pause());
        this.on('mouseleave', e => this.autoplay() && this.play());
        this.listen('dom', () => {
            this.jumpTo(this.index);
            // handle autopause
            if (this.node && !this.#observer) {
                this.#observer = new ResizeObserver(() => {
                    if (this.inDOM() && this.autoplay()) this.play();
                    else this.pause();
                })
                this.#observer.observe(this.node)
            }

            if (this.autoplay()) this.play();
        })
        this.touchHandler();
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            display: 'block',
            position: 'relative',
            touchAction: 'pan-y',

            'html:not([touch]) &:not([nopage]):hover': {
                'button.carousel-prev, button.carousel-next': {
                    visibility: 'visible'
                }
            }
        }))
    }

    override props({ interval, hoverpause, autoplay, loop, ...props }: $.Props<CarouselProps>): void {
        super.props(props);
        this.autoplay(autoplay);
        this.loop(loop);
        this.interval(interval);
        this.hoverpause(hoverpause);
    }

    autoplay(): boolean;
    autoplay(boolean?: OrSignal<boolean>): void
    autoplay(boolean?: OrSignal<boolean>) {
        if (!arguments.length) return this.hasAttr('autoplay');
        if (Utils.isUndefined(boolean)) return;
        $.resolve(boolean, boolean => {
            this.attr('autoplay', boolean ? '' : Utils.Null);
        });
    }

    loop(): boolean;
    loop(boolean?: OrSignal<boolean>): void
    loop(boolean?: OrSignal<boolean>) {
        if (!arguments.length) return this.hasAttr('loop');
        if (Utils.isUndefined(boolean)) return;
        $.resolve(boolean, boolean => {
            this.attr('loop', boolean ? '' : Utils.Null);
        });
    }

    hoverpause(): boolean;
    hoverpause(boolean?: OrSignal<boolean>): void
    hoverpause(boolean?: OrSignal<boolean>) {
        if (!arguments.length) return this.hasAttr('hoverpause');
        if (Utils.isUndefined(boolean)) return;
        $.resolve(boolean, boolean => {
            this.attr('hoverpause', boolean ? '' : Utils.Null);
        });
    }

    interval(): number;
    interval(number?: OrSignal<number>): void;
    interval(number?: OrSignal<number>) {
        if (!arguments.length) return this.#interval;
        if (Utils.isUndefined(number)) return;
        $.resolve(number, number => {
            this.#interval = number;
        });
    }

    play() {
        if (this.playing) return;
        this.playing = true;
        this.timer = setInterval(() => {
            if (!this.inDOM()) this.pause();
            this.#passed++;
            if (this.#passed >= this.#interval * 100) {
                this.switch('next');
                this.#passed = 0;
            }
        }, 10);
    }

    pause() {
        this.playing = false;
        if (this.timer) clearTimeout(this.timer);
    }

    stop() {
        this.pause();
        this.#passed = 0;
    }

    private targetItems(index: number) {
        const itemArr = Utils.arrayFrom(this.itemList);
        const $targetItem = itemArr.at(index);
        const $prevItem = itemArr.at(index - 1);
        const $nextItem = itemArr.at(index + 1 >= itemArr.length ? 0 : index + 1);
        return Utils.tuple($prevItem, $targetItem, $nextItem)
    }

    private setItemsStyle(index: number) {
        const [$prevItem, $targetItem, $nextItem] = this.targetItems(index);
        const gap = this.attr('gap') ?? '0px';
        const setStyle = (proto: CarouselItem | undefined, offset: number) => proto?.style({ transform: `translate(calc((100% + ${gap}) * ${this.transformIndex + offset}))` });
        setStyle($targetItem, 0);
        if (index !== 0 || (this.itemList.size > 2 && this.loop())) setStyle($prevItem, -1);
        if (index !== this.itemList.size - 1 || (this.itemList.size > 2 && this.loop())) setStyle($nextItem, 1);
    }

    switch(direction: 'next' | 'prev') {
        const contentNode = this.$content?.node;
        const containerNode = this.$container?.node;
        if (!contentNode || !containerNode) return;
        const itemArr = Utils.arrayFrom(this.itemList);
        if (itemArr.length <= 1) return;
        if (direction === 'next') {
            if (this.index + 1 >= itemArr.length) {
                if (this.loop()) this.index = 0;
                else return;
            }
            else this.index++;

            if (itemArr.length <= 2 && this.index === 0) this.transformIndex = 0;
            else this.transformIndex++;
        }
        else {
            if (this.index - 1 < 0) {
                if (this.loop()) this.index = itemArr.length - 1;
                else return;
            }
            else this.index--;
            this.transformIndex--;
        }
        this.jump(true);
    }

    jumpTo(index: number) {
        const contentNode = this.$content?.node;
        if (!contentNode) return;
        const itemArr = Utils.arrayFrom(this.itemList);
        if (index >= itemArr.length) return;
        this.index = index < 0 ? itemArr.length + index : index;
        this.jump();
    }

    private jump(animation = false) {
        this.setItemsStyle(this.index);
        const targetItems = this.targetItems(this.index);
        Utils.forEach(this.itemList, $item => $item.visible = false);
        Utils.forEach(targetItems, $item => $item && ($item.visible = true))
        this.toDOM();
        if (animation) this.animateTo(this.transformIndex);
        this.$targetItem = targetItems[1] ?? Utils.Null;
        this.dispatch('carousel_switch', [this], {bubbles: true})
        this.$targetItem?.dispatch('carousel_target', [], {bubbles: true})
        this.stop();
        if (this.autoplay()) this.play();
    }

    animateTo(index: number) {
        const contentNode = this.$content?.node;
        if (!contentNode) return;
        if (this.inDOM()) {
            this.animation?.commitStyles();
            this.animation?.cancel();
        }
        const currentTransform = contentNode.computedStyleMap().get('transform')?.toString();
        const gap = this.attr('gap') ?? '0px';

        this.animation = contentNode.animate({
            transform: [currentTransform ?? '', `translateX( calc((-100% - ${gap}) * ${index}) )`]
        }, {
            duration: 500,
            easing: 'ease',
            fill: 'both',
        })
    }

    private touchHandler() {
        const pointerdown = (e: PointerEvent) => {
            if (e.pointerType === 'mouse') return;
            this.pause();
            this.animation?.commitStyles();
            this.animation?.cancel();
            let moved = {x: 0, y: 0};
            let movement = {x: 0, y: 0};

            const pointermove = (e: PointerEvent) => {
                moved = {
                    x: moved.x + e.movementX,
                    y: moved.y + e.movementY
                }
                
                movement = {
                    x: e.movementX,
                    y: e.movementY
                }

                const contentNode = this.$content?.node;
                if (!contentNode) return;
                const transform = parseMatrix2D(window.getComputedStyle(contentNode).transform);
                contentNode.style.transform = `translate(${transform.x + e.movementX}px)`;
            }

            const cancel = (e: PointerEvent) => {
                removeListeners();
                if (this.autoplay()) this.play();

                const movenext = moved.x < -100 || movement.x < -10;
                const moveprev = moved.x > 100 || movement.x > 10;

                // not allow loop
                if (!this.loop()) {
                    if (this.index === 0 && moveprev) return this.animateTo(this.transformIndex);
                    if (this.index === this.itemList.size - 1 && movenext) return this.animateTo(this.transformIndex);
                }

                // no items to switch
                if (this.itemList.size === 1) return this.animateTo(this.transformIndex);

                if (movenext && !(this.itemList.size === 2 && this.index === 1)) this.switch('next');
                else if (moveprev && !(this.itemList.size === 2 && this.index === 0)) this.switch('prev');
                else this.animateTo(this.transformIndex);
            }

            const removeListeners = () => {
                this.off('pointermove', pointermove);
                this.off('pointerup', cancel);
                this.off('pointercancel', cancel);
            }

            this.on('pointermove', pointermove)
            this.on('pointerup', cancel)
            this.on('pointercancel', cancel)
        }

        this.on('pointerdown', pointerdown)
    }
}

export class CarouselContainer extends ElementProto {
    static tagname = 'carousel-container';
    $carousel: Carousel | null = Utils.Null;
    declare __child__: CarouselItem;
    constructor(props: $.Props, layout?: $.Layout<CarouselContainer>) {
        super(CarouselContainer.tagname, props, layout);
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            display: 'block',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
            margin: 'auto',
        }))
    }
        
    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$carousel = this.findAbove<Carousel>(proto => Utils.isInstanceof(proto, Carousel));
        if (this.$carousel) this.$carousel.$container = this;
        return this;
    }
}

export class CarouselContent extends ElementProto {
    static tagname = 'carousel-content';
    $carousel: Carousel | null = Utils.Null;
    declare __child__: CarouselItem;
    override virtual: boolean = true;
    constructor(props: $.Props, layout?: $.Layout<CarouselContent>) {
        super(CarouselContent.tagname, props, layout);
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            display: 'grid',
            height: '100%',
            gridTemplateColumns: '1fr',
            gridTemplateRows: '1fr',
            willChange: 'transfrom'
        }))
    }
        
    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$carousel = this.findAbove<Carousel>(proto => Utils.isInstanceof(proto, Carousel));
        if (this.$carousel) {
            this.$carousel.$content = this;
            const $item = Utils.arrayFrom(this.$carousel.itemList).at(this.$carousel.index);
            if ($item) {
                this.$carousel.$targetItem = $item;
                $item.visible = true;
            }
        }
        this.nopage();
        return this;
    }

    override mutate(): void {
        super.mutate();
        this.$carousel?.itemList.clear();
        Utils.forEach(this.children, ($item, i) => {
            if (i === this.$carousel?.index) {
                this.$carousel.$targetItem = $item;
                $item.visible = true;
            }
            this.$carousel?.itemList.add($item)
        });
        this.nopage();
    }

    private nopage() {
        if (!this.$carousel) return;
        this.$carousel.attr('nopage', this.$carousel.itemList.size <= 1 ? '' : Utils.Null);
    }
}

export class CarouselItem extends ElementProto {
    static tagname = 'carousel-item';
    $carousel: Carousel | null = Utils.Null;
    override visible: boolean = false;
    constructor(props: $.Props, layout?: $.Layout<CarouselItem>) {
        super(CarouselItem.tagname, props, layout);
    }
        
    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$carousel = this.findAbove<Carousel>(proto => Utils.isInstanceof(proto, Carousel));
        if (this.$carousel) this.$carousel.itemList.add(this);
        return this;
    }

    static {
        $.style(this, toUICSS(this.tagname, {
            position: 'relative',
            height: '100%',
            width: '100%',
            flexShrink: '0',
            gridArea: '1 / 1 / 2 / 2',
            willChange: 'transfrom',
            overflow: 'hidden'
        }))
    }
}

export class CarouselNext extends Button {
    $carousel: Carousel | null = Utils.Null;
    constructor(props: $.Props<ButtonProps>, layout?: $.Layout<CarouselNext>) {
        super(props, layout as any);
        this.on('click', () => this.$carousel?.switch('next'))
        this.addClass('carousel-next')
    }

    static {
        $.style(this, toUICSS('button.carousel-next', {
            position: 'absolute',
            inset: '0',
            width: 'calc(var(--spacing) * 8)',
            marginBlock: 'auto',
            marginInline: 'auto 1rem',
            visibility: 'hidden'
        }))
    }
        
    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$carousel = this.findAbove<Carousel>(proto => Utils.isInstanceof(proto, Carousel));
        this.checkDisabled();
        this.$carousel?.listen('carousel_switch', () => this.checkDisabled())
        return this;
    }

    private checkDisabled() {
        if (!this.$carousel?.loop() && this.$carousel!.index >= this.$carousel!.itemList.size - 1) this.attr('disabled', '');
        else this.attr('disabled', Utils.Null)
    }
}

export class CarouselPrev extends Button {
    $carousel: Carousel | null = Utils.Null;
    constructor(props: $.Props<ButtonProps>, layout?: $.Layout<CarouselPrev>) {
        super(props, layout as any);
        this.on('click', () => this.$carousel?.switch('prev'));
        this.addClass('carousel-prev');
    }

    static {
        $.style(this, toUICSS('button.carousel-prev', {
            position: 'absolute',
            inset: '0',
            width: 'calc(var(--spacing) * 8)',
            marginBlock: 'auto',
            marginInline: '1rem auto',
            visibility: 'hidden'
        }))
    }
        
    override build(cascading?: boolean): this {
        super.build(cascading);
        this.$carousel = this.findAbove<Carousel>(proto => Utils.isInstanceof(proto, Carousel));
        this.checkDisabled();
        this.$carousel?.listen('carousel_switch', () => this.checkDisabled())
        return this;
    }

    private checkDisabled() {
        if (!this.$carousel?.loop() && this.$carousel?.index === 0) this.attr('disabled', '');
        else this.attr('disabled', Utils.Null)
    }
}

declare global {
    export namespace $ {
        export interface ProtoEventMap<P> {
            carousel_switch: [Carousel];
            carousel_target: [];
        }
    }
}