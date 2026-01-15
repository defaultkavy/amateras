import type { ElementProto } from "@amateras/core/structure/ElementProto";
import { Proto } from "@amateras/core/structure/Proto";
import { _Object_assign } from "@amateras/utils";
import { WidgetConstructor, type Widget } from "./structure/Widget";

export type WidgetChildrenLayout = (proto: ElementProto | undefined) => void;
export type WidgetConstructLayout<Store> = ($$: {store: Store, children: (proto?: ElementProto) => void}) => void;

export type WidgetInit<Store = any, Ancestors = Widget[], ParentStore = any> = 
    | {
        ancestors?: Ancestors,
        store?: Store,
        layout: WidgetConstructLayout<
            ParentStore extends Record<string, any>
            ?   Store extends Record<string, any>
                ?   Prettify<ParentStore & Store>
                :   ParentStore
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
                ?   [props?: $.Props<Props>, children?: WidgetChildrenLayout] | [children?: WidgetChildrenLayout] 
                :   [props: $.Props<Props>, children?: WidgetChildrenLayout]
        ): Proto;

    export namespace $ {
        export function test<$$ extends Proto, Props = never>(
            widget: Widget<$$, Props>,
            ...args: 
                RequiredKeys<Props> extends never
                ?   [props?: $.Props<Props>, children?: WidgetChildrenLayout] 
                :   [props: $.Props<Props>, children?: WidgetChildrenLayout]
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

export * from "#structure/Widget";
