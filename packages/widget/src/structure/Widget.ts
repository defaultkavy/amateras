import { Proto, ProxyProto, symbol_ProtoType } from "@amateras/core";
import type { WidgetBuilder } from "..";

export const WidgetConstructor = (builder: WidgetBuilder) => {
    const Widget = class extends ProxyProto {
        static override readonly [symbol_ProtoType] = 'Widget' as any;
        static override name = 'Widget';
        static builder = builder;
        constructor(props: $.Props, layout?: $.Layout) {
            super(() => Widget.builder(props, (proto) => layout?.(proto)));
        }
    } as unknown as WidgetConstructor
    return Widget;
}

export interface WidgetConstructor<Props = {}, Parent extends Proto = any> {
    [symbol_ProtoType]: 'Widget';
    builder: WidgetBuilder;
    new (builder: WidgetBuilder): Widget<Props, Parent>;
}

export interface Widget<Props = {}, Parent extends Proto = any> extends Proto {
    props: Props;
    parent: Parent;
}