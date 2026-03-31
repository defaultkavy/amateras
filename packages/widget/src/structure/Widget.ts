import { Proto, symbol_ProtoType } from "@amateras/core";
import type { WidgetBuilder } from "..";

export const WidgetConstructor = (builder: WidgetBuilder) => {
    return class extends Proto {
        static override [symbol_ProtoType] = 'Widget';
        static override name = 'Block';
        constructor(props: $.Props, layout?: $.Layout) {
            super(() => builder(props, (proto) => layout?.(proto)));
        }
    }
}

export interface Widget<Props = {}, Parent extends Proto = any> extends Proto {
    new (builder: WidgetBuilder): Widget<Props, Parent>
    props: Props;
    parent: Parent;
}