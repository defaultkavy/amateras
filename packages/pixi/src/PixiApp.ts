import { Application, type ApplicationOptions } from "pixi.js";
import { PixiProto } from "./PixiProto";
import { Utils } from '@amateras/utils';
import { ElementProto } from "@amateras/core";
import { PixiDiv } from "./PixiDiv";

export class PixiApp extends PixiProto {
    app = new Application();
    options: Partial<ApplicationOptions>;
    initialized = false;
    constructor(options: Partial<ApplicationOptions>, layout?: $.Layout<PixiApp>) {
        super(layout as $.Layout);
        this.options = options;
    }

    override build() {
        return this;
    }

    override toDOM() {
        if (this.initialized) return [];
        this.initialized = true;
        this.app.init(this.options).then(() => {
            if (Utils.isInstanceof(this.parent, ElementProto)) this.parent?.node?.append(this.app.canvas);
            super.build();
            this.toPixi();
        })
        return []
    }

    updateLayout() {
        Utils.forEach(this.protos, proto => {
            if (!Utils.isInstanceof(proto, PixiDiv)) return;
            proto.resizeLayout(this.app.screen);
        })
    }

    override toPixi() {
        const pixs = super.toPixi();
        this.app.stage.addChild(...pixs);
        new ResizeObserver(() => this.updateLayout()).observe(this.app.canvas);
        return pixs
    }
}