import { Proto, symbol_ProtoType } from "@amateras/core";
import type { WidgetBuilder } from "..";

export const WidgetConstructor = (builder: WidgetBuilder) => {
    return class extends Proto {
        static override [symbol_ProtoType] = 'Widget';
        static override name = 'Widget';
        constructor(props: $.Props, layout?: $.Layout) {
            super(() => builder(props, (proto) => layout?.(proto)));
        }
    } as unknown as WidgetConstructor
}

export interface WidgetConstructor<Props = {}, Parent extends Proto = any> extends Constructor<Proto> {
    [symbol_ProtoType]: 'Widget';
    new (builder: WidgetBuilder): Widget<Props, Parent>;
}

export interface Widget<Props = {}, Parent extends Proto = any> extends Proto {
    props: Props;
    parent: Parent;
}