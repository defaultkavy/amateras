import { ElementProto, onclient } from "@amateras/core";
import { forEach } from "@amateras/utils";
import type { WaterfallItem } from "./WaterfallItem";
export interface WaterfallOptions {
    gap?: number;
    columns?: number;
    size?: number;
}
export class Waterfall extends ElementProto {
    declare __child__: WaterfallItem;
    gap: number;
    columns: number;
    size: number;
    observer: ResizeObserver | null = null;
    constructor({gap, columns, autosize, size, ...props}: $.Props<WaterfallOptions>, layout?: $.Layout<Waterfall>) {
        super('waterfall', props, layout);
        this.gap = gap ?? 0;
        this.columns = columns ?? 1;
        this.size = size ?? 0;
        if (onclient()) this.observer = new ResizeObserver(() => {
            if (!this.inDOM()) return;
            requestAnimationFrame(() => this.refresh());
        })
    }

    static {
        $.style(Waterfall, 'waterfall{display:block;position:relative;min-height:100dvh}')
    }

    override toDOM(children?: boolean): HTMLElement[] {
        super.toDOM(children);
        if (this.node) this.observer?.observe(this.node);
        return [this.node!]
    }

    refresh() {
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
        forEach(this.children, $item => {
            if (!$item.node) return;
            if (!$item.ratio) {
                if ($item.node.offsetHeight && $item.node.offsetWidth)
                    $item.ratio = $item.node.offsetWidth / $item.node.offsetHeight;
            }
            const itemHeight = colWidth / $item.ratio;
            const shortestCol = colList.sort((a, b) => a.height - b.height)[0]!;
            $item.style({
                height: `${itemHeight}px`,
                width: `${colWidth}px`,
                top: `${shortestCol.height}px`,
                left: `${shortestCol.left}px`
            })
            shortestCol.height += itemHeight + this.gap;
        })
    }

    override mutate(): void {
        this.refresh();
    }
}