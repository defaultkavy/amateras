import { Proto } from "@amateras/core/structure/Proto";
import { isArray, isFunction, forEach, _Object_assign } from "@amateras/utils";
import { WidgetConstructor, type Widget } from "./structure/Widget";

export type WidgetChildrenBuilder<$$ extends Proto> = (proto: $$) => void;
export type WidgetConstructBuilder<Store> = ($$: {store: Store, children: () => void}) => void;

export type WidgetInit<Store = any, Ancestors = Widget[], ParentStore = any> = 
    | {
        ancestors?: Ancestors,
        store?: Store,
        builder: WidgetConstructBuilder<
            ParentStore extends Record<string, any>
            ?   Store extends Record<string, any>
                ?   Prettify<ParentStore & Store>
                :   Store
            :   Store extends Record<string, any>
                ?   Store
                :   {}
        >
    }

type MergeAncestorStore<T extends any[]> = 
    MergeUnionType<
        T extends Array<infer W> 
        ?   W extends Widget<any, any, infer Store> 
            ?   Store
            :   never
        : never
    >

type MergeUnionType<U> = 
    (
        U extends any 
        ? (k: U) => void 
        : never
    ) extends (k: infer I) => void
        ?   I
        :   never;

declare global {
    export function $<$$ extends Proto, Props = never>(
        widget: Widget<$$, Props>,
            ...args: 
                RequiredKeys<Props> extends never
                ?   [props?: $.Props<Props>, children?: WidgetChildrenBuilder<$$>] 
                :   [props: $.Props<Props>, children?: WidgetChildrenBuilder<$$>]
        ): Proto;

    export namespace $ {
        export function test<$$ extends Proto, Props = never>(
            widget: Widget<$$, Props>,
            ...args: 
                RequiredKeys<Props> extends never
                ?   [props?: $.Props<Props>, children?: WidgetChildrenBuilder<$$>] 
                :   [props: $.Props<Props>, children?: WidgetChildrenBuilder<$$>]
        ): Proto;

        export function widget<$$ extends Proto, Props extends $.Props, Store, Ancestors, ParentStore extends MergeAncestorStore<Ancestors extends any[] ? Ancestors : []>>(
            init: (props: Props) => WidgetInit<Store, Ancestors, ParentStore>
        ): Widget<$$, Props, Store>;
    }
}

_Object_assign($, {
    widget<$$ extends Proto, Props, Store>(arg1: any) {
        let Widget = WidgetConstructor(arg1);
        return Widget;
    }
})
