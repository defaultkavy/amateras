import { _Array_from, _instanceof, equal, forEach, isNumber } from "amateras/lib/native";
import { $HTMLElement } from "amateras/node/$HTMLElement";
import { $Element } from "amateras/node/$Element";
import { $Virtual } from "amateras/node/$Virtual";
import { chain } from "../../../src/lib/chain";

const getRect = (el: $Element) => el.getBoundingClientRect();
const px = (value: number) => `${value}px`;
$.style(`waterfall{display:block;position:relative}`)

export class Waterfall extends $Virtual {
    #column: number | null = null;
    #columnWidth: number = 200;
    #mode: WaterfallMode = 'fill';
    #gap = 0;
    #width = 0;
    constructor() {
        super('waterfall');
        new ResizeObserver(_ => this.inDOM() && this.#width !== getRect(this).width && (this.dispatchEvent(new Event('resize', {cancelable: true})) && this.layout())).observe(this.node);
    }

    mode(): WaterfallMode;
    mode(mode: $Parameter<'fill' | 'fixed'>): this;
    mode(mode?: $Parameter<'fill' | 'fixed'>) {
        return chain(this, arguments, () => this.#mode, mode, value => this.#mode = value);
    }

    column(): number | null;
    column(column: $Parameter<number | null>): this;
    column(column?: $Parameter<number | null>) {
        return chain(this, arguments, () => this.#column, column, value => this.#column = value);
    }

    columnWidth(): number
    columnWidth(width: $Parameter<number>): this
    columnWidth(width?: $Parameter<number>) {
        return chain(this, arguments, () => this.#columnWidth, width, value => this.#columnWidth = value) 
    }

    gap(): number;
    gap(gap: $Parameter<number>): this;
    gap(gap?: $Parameter<number>) {
        return chain(this, arguments, () => this.#gap, gap, value => this.#gap = value);
    }

    layout() {
        const items = _Array_from(this.nodes).map(item => item);
        const { width } = getRect(this);
        this.#width = width;
        const gap = this.#gap;
        const columnCount = (() => {
            if (this.#column) return this.#column;
            const colCount = Math.floor(width / this.#columnWidth) || 1;
            return ((colCount - 1) * gap) + this.#columnWidth * colCount > width ? colCount - 1 || 1 : colCount;
        })()
        const maxColumnWidth = (width - ((columnCount - 1) * gap)) / columnCount
        const columnWidth = this.#mode === 'fill' ? maxColumnWidth : this.#columnWidth;
        const padding = (width - columnWidth * columnCount - gap * (columnCount - 1)) / 2;
        const columns = _Array_from({length: columnCount}).map((_, i) => ({ i, h: 0, x: i * (columnWidth + gap) + padding }))
        const getColumnByHeight = (i: number) => columns.sort((a, b) => a.h - b.h ? a.h - b.h : a.i - b.i).at(i) as typeof columns[number];
        forEach(items, item => {
            if (!_instanceof(item, $HTMLElement)) return;
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
                item.style({ visibility: '', height: px(itemHeight) })
                shortestSection.h += +itemHeight + gap;
            }
        })
        this.style({ height: px(getColumnByHeight(-1).h) });
        this.dispatchEvent(new Event('layout'))
        return this;
    }
}

export type WaterfallMode = 'fill' | 'fixed'