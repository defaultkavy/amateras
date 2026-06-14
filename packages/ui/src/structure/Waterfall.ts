import { toUICSS } from "#lib/toCSS";
import { ElementProto, onclient, onserver } from "@amateras/core";
import { Utils } from '@amateras/utils';
export interface WaterfallOptions {
    gap?: number;
    columns?: number;
    size?: number;
}
export class Waterfall extends ElementProto {
    declare __child__: WaterfallItem;
    declare __protos__: WaterfallItem;
    gap: number;
    columns: number;
    size: number;
    observer: ResizeObserver | null = null;
    constructor({gap, columns, autosize, size, ...props}: $.Props<WaterfallOptions>, layout?: $.Layout<Waterfall>) {
        super('waterfall', props, layout);
        this.gap = gap ?? 0;
        this.columns = columns ?? 1;
        this.size = size ?? 0;
        if (onclient()) this.observer = new ResizeObserver((ent) => {
            if (!this.inDOM()) return;
            requestAnimationFrame(() => this.resize());
        })
        this.listen('dom', node => this.observer?.observe(node));
        this.listen('waterfall_resize', () => this.resize());
        this.listen('mutate', () => this.resize());

        if (onserver()) {
            this.attr('style', `display: flex; flex-direction: column; gap: ${gap}px`)
        }
    }

    static {
        $.style(this, toUICSS('waterfall', {
            display: 'block',
            position: 'relative',
        }))
    }

    resize() {
        if (!this.node) return;
        const colList: Column[] = [];
        type Column = {
            items: WaterfallItem[];
            height: number;
            width: number;
            left: number;
        };
        const fullwidth = this.node.offsetWidth;
        let columns = this.columns;
        if (this.size) columns = Math.trunc(fullwidth / (this.size + this.gap)) || 1;
        const colWidth = (fullwidth - this.gap * (columns - 1)) / columns;
        // add each column data to column list
        for (let i = 0; i < columns; i ++) colList.push({items: [], height: 0, width: colWidth, left: i * (colWidth + this.gap)});
        // calculate item height and position
        Utils.forEach(this.children, $item => {
            if (!$item.node) return;
            // if (!$item.ratio) {
            //     if ($item.node.offsetHeight && $item.node.offsetWidth)
            //         $item.ratio = $item.node.offsetWidth / $item.node.offsetHeight;
            // }
            if ($item.node.offsetHeight) {
                $item.height = $item.node.offsetHeight;
            }
            // const itemHeight = colWidth / $item.ratio;
            const shortestCol = colList.sort((a, b) => a.height - b.height)[0]!;
            $item.style({
                // height: `${$item.height}px`,
                width: `${colWidth}px`,
                translate: `${shortestCol.left}px ${shortestCol.height}px`,
            })
            shortestCol.height += $item.height + this.gap;
        })
        this.style({
            height: `${colList.sort((a, b) => b.height - a.height)[0]!.height}px`
        })
    }
}

export class WaterfallItem extends ElementProto {
    ratio = 0;
    height = 0;
    constructor(props: $.Props, layout?: $.Layout<WaterfallItem>) {
        super('waterfall-item', props, layout);
    }

    static {
        $.style(this, toUICSS('waterfall-item', {
            display: 'block',
            position: onclient() ? 'absolute' : 'static'
        }))
    }

    override toDOM(children = true): HTMLElement[] {
        let nodes = super.toDOM(children);
        const $waterfall = this.findAbove<Waterfall>(proto => Utils.is(proto, Waterfall));
        this.node?.querySelectorAll('img').forEach(img => $waterfall?.observer?.observe(img));
        return nodes;
    }
}

declare global {
    export namespace $ {
        export interface ProtoEventMap<P> {
            waterfall_resize: []
        }
    }
}