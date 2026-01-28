import { Proto } from "@amateras/core";
import { _Object_assign } from "@amateras/utils";
import { WidgetConstructor, type Widget } from "./structure/Widget";

export type WidgetChildrenLayout<$$ extends Constructor | null> = (proto: $$ extends Constructor ? InstanceType<$$> : undefined) => void;
export type WidgetConstructLayout<$$ extends Constructor | null, Store> = (
    context: {
        store: Store, 
        children: (
            ...args: 
                $$ extends Constructor 
                ?   [proto: InstanceType<$$>] 
                :   []
        ) => void
    }
) => void;

type WidgetInitLayoutStore<ParentStore, Store> = 
    ParentStore extends Record<string, any>
    ?   Store extends Record<string, any>
        ?   Prettify<ParentStore & Store>
        :   ParentStore
    :   Store extends Record<string, any>
        ?   Store
        :   {}

export type WidgetInit<$$ extends Constructor | null = null, Store = any, Ancestors = Widget[], ParentStore = any> = 
    | {
        ancestors?: Ancestors,
        store?: Store,
        $$?: $$,
        layout: WidgetConstructLayout<$$, WidgetInitLayoutStore<ParentStore, Store>>
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

type WidgetCraftArguments<$$ extends Constructor | null, Props> = 
        RequiredKeys<Props> extends never
        ?   [children?: WidgetChildrenLayout<$$>] | [props?: $.Props<Props>, children?: WidgetChildrenLayout<$$>]
        :   [props: $.Props<Props>, children?: WidgetChildrenLayout<$$>]

declare global {
    export function $<$$ extends Constructor | null, Props = never>(
            widget: Widget<$$, Props>,
            ...args: WidgetCraftArguments<$$, Props>
        ): Proto;

    export namespace $ {
        export function widget<
        Props extends $.Props, 
        Store, 
        Ancestors, 
        ParentStore extends MergeAncestorStore<Ancestors extends any[] ? Ancestors : []>,
        $$ extends Constructor | null = null
        >(init: (props: Props) => WidgetInit<$$, Store, Ancestors, ParentStore>): Widget<$$, Props, Store>;
    }
}

_Object_assign($, {
    widget(arg1: any) {
        let Widget = WidgetConstructor(arg1);
        return Widget;
    }
})

export * from "#structure/Widget";
