import { onclient } from "#env";
import { ElementProto } from "#structure/ElementProto";
import { _instanceof, forEach } from "@amateras/utils";

export const VirtualScroll = ($parent: ElementProto) => {
    if (!onclient()) return;
    document.addEventListener('scroll', () => render($parent), true);
    $parent.listen('dom', node => new ResizeObserver(() => render($parent)).observe(node)) 
    $parent.listen('mutate', () => render($parent))
    $parent.virtual = true;
}

const render = ($parent: ElementProto) => {
    if (!$parent.inDOM()) return;
    if (!$parent.node) return;
    const parentRect = $parent.node?.getBoundingClientRect();
    forEach($parent.children, $child => {
        if (!_instanceof($child, ElementProto)) return;
        if (!$child.node) return;
        const { translate } = $child.node.style;
        const top = translate.split(' ')[1] as string;
        const topPos = parentRect.top + parseInt(top);
        const bottomPos = topPos + $child.node.offsetHeight;
        if (bottomPos < 0 - 200 || topPos > outerHeight + 200) $child.visible = false;
        else $child.visible = true;
    })
    $parent.toDOM();
}