import '@amateras/core';
import * as Pixi from 'pixi.js';
import { PixiProto } from './PixiProto';
import { Utils } from '@amateras/utils';

export class PixiContainer extends PixiProto {
    override pix = new Pixi.Container();
    constructor(layout?: $.Layout<PixiContainer>) {
        super(layout as $.Layout<PixiProto>);
    }

    override toPixi(): [Pixi.Container] {
        super.toPixi();
        Utils.forEach(this.protos, proto => {
            this.pix.addChild(...proto.toPixi());
        })
        return [this.pix]
    }
}