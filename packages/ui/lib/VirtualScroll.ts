import { _document } from "@amateras/core/env";
import { $HTMLElement } from "@amateras/core/node/$HTMLElement";
import type { $Node } from "@amateras/core/node/$Node";
import type { $Virtual } from "@amateras/core/node/$Virtual";
import { _Array_from, _instanceof, forEach } from "@amateras/utils";

export const VirtualScroll = ($parent: $Virtual, scroller: $Node = $(_document)) => {
    scroller.on('scroll', () => render($parent), true);
    $parent.on('layout', () => render($parent));
}

const render = ($parent: $Virtual) => {
    const number = parseInt;
    const parentRect = $parent.getBoundingClientRect();
    const children = _Array_from($parent.nodes);
    forEach(children, $child => {
        if (!_instanceof($child, $HTMLElement)) return;
        const { top, height } = $child.style();
        const topPos = parentRect.top + number(top);
        const bottomPos = topPos + number(height);
        if (bottomPos < 0 || topPos > outerHeight + 200) $parent.hide($child);
        else $parent.show($child);
    })
    $parent.render();
}