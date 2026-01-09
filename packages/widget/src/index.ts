import { Proto } from "@amateras/core/structure/Proto";
import { isArray, isFunction, forEach, _Object_assign } from "@amateras/utils";
import { WidgetConstructor, type Widget } from "./structure/Widget";

export type WidgetChildrenBuilder<$$ extends Proto> = (proto: $$) => void;
export type WidgetConstructBuilder<Store> = ($$: {store: Store, children: () => void}) => void;

export type WidgetInit<Props = any, Store = any, ParentStore = {}> = (props: Props) => [
    store: Store,
    builder: WidgetConstructBuilder<Prettify<ParentStore & Store>>
] | [
    builder: WidgetConstructBuilder<ParentStore>
]


declare global {
    export function $<$$ extends Proto, Props = never>(
        widget: Widget<$$, Props>,
        ...args: RequiredKeys<Props> extends never
        ?   [props?: $.Props<Props>, children?: WidgetChildrenBuilder<$$>] 
        :   [props: $.Props<Props>, children?: WidgetChildrenBuilder<$$>]
    ): Proto;

    export namespace $ {
        export function test<$$ extends Proto, Props = never>(
        widget: Widget<$$, Props>,
        ...args: RequiredKeys<Props> extends never
        ?   [props?: $.Props<Props>, children?: WidgetChildrenBuilder<$$>] 
        :   [props: $.Props<Props>, children?: WidgetChildrenBuilder<$$>]
    ): Proto;
        export function widget<$$ extends Proto = any, Props = $.Props, Store = {}, ParentStore = {}>(
            ancestors: Widget<any, any, ParentStore>[], 
            init: WidgetInit<Props, Store, ParentStore>
        ): Widget<$$, Props, Prettify<Store & ParentStore>>

        export function widget<$$ extends Proto = any, Props = $.Props, Store = {}>(
            init: WidgetInit<Props, Store, {}>
        ): Widget<$$, Props, Store>;
    }
}

_Object_assign($, {
    widget<$$ extends Proto, Props, Store>(arg1: any, arg2?: any) {
        let ancestors: Widget[] = isArray(arg1) ? arg1 : [];
        let init: WidgetInit = isFunction(arg1) ? arg1 : arg2;
        let stores = new WeakMap<Proto, Store>;

        let Widget = WidgetConstructor(ancestors, stores, init);
        return Widget;
    }
})
