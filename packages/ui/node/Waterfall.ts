import { _Array_from, _instanceof, equal, forEach, isNumber } from "amateras/lib/native";
import { $HTMLElement } from "amateras/node/$HTMLElement";
import { $Element } from "amateras/node/$Element";
import { $Virtual } from "amateras/node/$Virtual";

const getRect = (el: $Element) => el.getBoundingClientRect();
const px = (value: number) => `${value}px`;
$.style(`waterfall { display: block; position: relative }`)

export class Waterfall extends $Virtual {
    #column = 1;
    #gap = 0;
    #width = 0;
    constructor() {
        super('waterfall');
        new ResizeObserver(_ => this.inDOM() && this.#width !== getRect(this).width && (this.dispatchEvent(new Event('resize', {cancelable: true})) && this.layout())).observe(this.node);
    }

    column(): number;
    column(column: $Parameter<number>): this;
    column(column?: $Parameter<number>) {
        if (!arguments.length) return this.#column;
        if (isNumber(column)) this.#column = column;
        return this;
    }

    gap(): number;
    gap(gap: $Parameter<number>): this;
    gap(gap?: $Parameter<number>) {
        if (!arguments.length) return this.#gap;
        if (isNumber(gap)) this.#gap = gap;
        return this;
    }

    layout() {
        const items = _Array_from(this.nodes).map(item => item);
        const { width } = getRect(this);
        this.#width = width;
        const columnCount = this.#column;
        const gap = this.#gap;
        const columnWidth = ((width - ((columnCount - 1) * gap)) / columnCount);
        const columns = _Array_from({length: columnCount}).map((_, i) => ({ i, h: 0, x: i * (columnWidth + gap) }))
        const getColumnByHeight = (i: number) => columns.sort((a, b) => a.h - b.h ? a.h - b.h : a.i - b.i).at(i) as typeof columns[number];
        forEach(items, item => {
            if (!_instanceof(item, $HTMLElement)) return;
            item.attr();
            const { height, width } = item.attr();
            const shortestSection = getColumnByHeight(0);
            item.style({
                position: 'absolute',
                top: px(shortestSection.h), 
                left: px(shortestSection.x), 
                width: px(columnWidth),
            });
            if (width && height) {
                // get ratio from attributes and calculate item's height
                let itemHeight = columnWidth / (+width / +height);
                item.style({ height: px(itemHeight) })
                shortestSection.h += +itemHeight + gap;
            } else {
                item.style({ visibility: 'hidden', height: '' })
                if (this.hiddenNodes.has(item)) this.show(item).render().hide(item);
                let itemHeight = getRect(item).height;
                item.style({visibility: '', height: px(itemHeight)})
                shortestSection.h += +itemHeight + gap;
            }
        })
        this.style({ height: px(getColumnByHeight(-1).h) });
        this.dispatchEvent(new Event('layout'))
        return this;
    }
}