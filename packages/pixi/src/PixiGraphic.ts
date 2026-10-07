import { PixiProto } from "./PixiProto";
import * as Pixi from "pixi.js";

export class PixiGraphic extends PixiProto {
    override pix = new Pixi.Graphics();
    constructor(layout?: $.Layout<PixiGraphic>) {
        super(layout as $.Layout<PixiProto>);
    }

    override toPixi(): [Pixi.Graphics] {
        return [this.pix]
    }
}