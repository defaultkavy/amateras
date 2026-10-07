import '@amateras/core';
import * as Pixi from 'pixi.js';
import { PixiProto } from './PixiProto';
import { Utils } from '@amateras/utils';

export interface PixiStyle {
    padding: number;
    paddingY: number;
    paddingX: number;
    paddingLeft: number;
    paddingRight: number;
    paddingTop: number;
    paddingBottom: number;
    backgroundColor: Pixi.FillInput;
    tint: Pixi.ColorSource;
    position: 'static' | 'absolute';
    display: 'inline' | 'block' | 'flex';
    width: string | number;
    height: string | number;
    borderRadius: number;
    cursor: Pixi.Cursor;
    x: number;
    y: number;
    direction: 'row' | 'column';
    gap: number;
    rowGap: number;
    columnGap: number;
    wrap: boolean;
}

export class PixiDiv extends PixiProto {
    override pix = new Pixi.Container({ label: 'Div' });
    graphic = new Pixi.Graphics({ label: 'Background', alpha: 0 });
    override __style__ = { display: 'block', boxSizing: 'xy', position: 'static' } as Partial<PixiStyle>;
    
    declare __child__: PixiProto;
    constructor(layout?: $.Layout<PixiDiv>) {
        super(layout as $.Layout<PixiProto>);
    }

    style(style: Partial<PixiStyle>) {
        this.__style__ = Utils.merge(this.__style__, style);
        const s = this.__style__;
        s.paddingLeft ??= style.paddingLeft ?? style.paddingX ?? style.padding;
        s.paddingRight ??= style.paddingRight ?? style.paddingX ?? style.padding;
        s.paddingTop ??= style.paddingTop ?? style.paddingY ?? style.padding;
        s.paddingBottom ??= style.paddingBottom ?? style.paddingY ?? style.padding;

        this.pix.cursor ??= style.cursor;
    }

    updateLayout() {
        const style = this.__style__;
        let w = 0;
        let h = 0;
        const pointer = {
            x: style.paddingLeft ?? 0,
            y: style.paddingTop ?? 0
        }
        let percentageSizePixList: PixiProto[] = [];

        if (style.display !== 'flex')
            Utils.forEach(this.children, proto => {
                const pix = proto.pix;
                if (!pix) return;
                proto.computeLayout({pointer, style, w, h});
                if (pix.x + pix.width > w) w = pix.x + pix.width;
                if (pix.y + pix.height > h) h = pix.y + pix.height;
                if (Utils.isString(proto.__style__.width)) percentageSizePixList.push(proto)
            })

        const {width, height, paddingRight, paddingBottom} = style;

        if (Utils.isNumber(width)) w = width;
        else w = w + (paddingRight ?? 0);
        if (Utils.isNumber(height)) h = height;
        else h = h + (paddingBottom ?? 0);

        this.drawGraphic(w, h, style.borderRadius ?? 0);

        Utils.forEach(percentageSizePixList, proto => {
            if (!Utils.isInstanceof(proto, PixiDiv)) return;
            proto.resizeLayout(this.pix, style)
        })
    }

    resizeLayout(container: Pixi.Container | Pixi.Rectangle, parentStyle: Partial<PixiStyle> = {}) {
        const {paddingRight, paddingBottom, paddingLeft, paddingTop} = parentStyle;
        const {width, height} = this.__style__;
        const w_percentage = Utils.isString(width) ? Number(width.match(/(\d+)\%/)?.[1]) : NaN;
        const h_percentage = Utils.isString(height) ? Number(height.match(/(\d+)\%/)?.[1]) : NaN;
        const w = isNaN(w_percentage) ? this.graphic.width : (container.width - (paddingRight ?? 0) - (paddingLeft ?? 0)) * (w_percentage / 100);
        const h = isNaN(h_percentage) ? this.graphic.height : (container.height - (paddingTop ?? 0) - (paddingBottom ?? 0)) * (h_percentage / 100);
        this.drawGraphic(w, h, 0);

        if (this.__style__.display === 'flex') {
            const style = this.__style__;
            const pointer = {
                x: style.paddingLeft ?? 0,
                y: style.paddingTop ?? 0
            }
            Utils.forEach(this.children, proto => {
                const pix = proto.pix;
                if (!pix) return;
                proto.computeLayout({pointer, style, w, h});
            })
        }
    }

    drawGraphic(width: number, height: number, radius: number) {
        if (this.__style__.backgroundColor) this.graphic.alpha = 1;
        this.graphic
        .clear()
        .roundRect(0, 0, width, height, radius)
        .fill(this.__style__.backgroundColor);
        this.graphic.tint = this.__style__.tint ?? this.graphic.tint;
    }

    override toPixi(): [Pixi.Container] {
        super.toPixi();
        this.pix.addChild(this.graphic);
        Utils.forEach(this.protos, proto => {
            this.pix.addChild(...proto.toPixi());
        })
        this.updateLayout();
        return [this.pix]
    }
}