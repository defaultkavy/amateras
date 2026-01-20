import type { SlideshowAnimationHandle } from "#structure/Slideshow";
import { onclient } from "@amateras/core/env";

export const slideInOut = (
    options?: {
        duration?: number,
        easing?: string,
        direction?: 'left' | 'right' | 'up' | 'down'
    }
): SlideshowAnimationHandle => 
    (slideshow, newSlide, oldSlide) => {
        slideshow.slide = newSlide;
        if (!onclient()) return;
        let newNodes = newSlide.toDOM();
        slideshow.node?.append(...newNodes);

        let animationOptions = {
            duration: options?.duration ?? 500,
            easing: options?.easing ?? 'ease'
        }

        let translate = $.match(options?.direction, $$ => $$
            .case('up', () => [['0 100%', '0 0'], ['0 0', '0 -100%']])
            .case('down', () => [['0 -100%', '0 0'], ['0 0', '0 100%']])
            .case('left', () => [['100% 0', '0 0'], ['0 0', '-100% 0']])
            .case('right', () => [['-100% 0', '0 0'], ['0 0', '100% 0']])
            .default(() => [['100% 0', '0 0'], ['0 0', '-100% 0']])
        )

        newSlide.node?.animate({
            translate: translate[0]
        }, animationOptions)
        
        const animation = oldSlide?.node?.animate({
            translate: translate[1]
        }, animationOptions)

        if (animation) animation.onfinish = () => oldSlide?.node?.remove();
    }