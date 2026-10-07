import { Proto } from "@amateras/core";
import { Utils } from "@amateras/utils";
import type { Container, Graphics, Sprite, Text } from "pixi.js";
import type { PixiStyle } from "./PixiDiv";

export type PixiElement = Graphics | Text | Sprite | Container;

export class PixiProto extends Proto {
    pix: PixiElement | null = Utils.Null;
    __style__: Partial<PixiStyle> = {};
    constructor(layout?: $.Layout<PixiProto>) {
        super(layout);
    }

    computeLayout(parent: {
        w: number, 
        h: number, 
        pointer: {x: number, y: number}, 
        style: Partial<PixiStyle>}
    ) {
        if (!this.pix) return;
        const pix = this.pix;
        const c_style = this.__style__;
        const p_style = parent.style;
        const pointer = parent.pointer;
        const {width, height} = pix;

        const resetPointer = (dir: 'x' | 'y') => 
            pointer[dir] = (dir === 'x' ? p_style.paddingLeft : p_style.paddingTop) ?? 0;

        if (p_style.display === 'flex') {
            if (p_style.direction === 'column') {
                pointer.x = p_style.paddingLeft ?? 0;
                pointer.y += p_style.gap ?? 0;
            }
            else {
                pointer.y = p_style.paddingTop ?? 0;
                pointer.x += p_style.gap ?? 0;
            }
            
        } else {
            if (c_style.display === 'block') resetPointer('x');
            if (c_style.display === 'inline') resetPointer('y')
        }

        if (c_style.position === 'static') {
            pix.x = pointer.x;
            pix.y = pointer.y;
        } else {
            pix.x = c_style.x ?? 0;
            pix.y = c_style.y ?? 0;
        }

        pointer.y += height;
        pointer.x += width;
    }
}

declare module "@amateras/core" {
    export interface Proto {
        toPixi(): PixiElement[];
    }
}

Utils.assign(Proto.prototype, {
    toPixi(this: Proto, children = true): PixiElement[] {
        let pixs: PixiElement[] = []
        Utils.forEach(this.protos, proto => {
            if (!proto.visible) proto.removeNode();
            else if (children) pixs.push(...proto.toPixi())
        });
        return pixs;
    }
})

// declare global {
//     export namespace $ {
//         export namespace pixi {
//             export function render(proto: PixiProto, app: Application): void;
//         }
//     }
// }
// Utils.assign($, {
//     pixi: {
//         render(proto: PixiProto, app: Application) {
//             const elements = proto.build().toPixi();
//             app.stage.addChild(...elements);
//         }
//     }
// })