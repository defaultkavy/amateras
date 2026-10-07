import '@amateras/core';
import * as Pixi from 'pixi.js';
import { PixiProto } from './PixiProto';
import type { PixiStyle } from './PixiDiv';

export class PixiText extends PixiProto {
    override pix = new Pixi.Text();
    override __style__ = { display: 'inline', position: 'static' } as PixiStyle;
    constructor(layout?: $.Layout<PixiText>) {
        super(layout as $.Layout<PixiProto>);
    }

    content(text: string) {
        this.pix.text = text;
        return this;
    }

    override toPixi(): [Pixi.Container] {
        return [this.pix]
    }
}