import { symbol_ProtoType } from "@amateras/core/lib/symbols";
import { Proto } from "@amateras/core/structure/Proto";
import { _Object_assign, forEach } from "@amateras/utils";
import type { WidgetChildrenLayout, WidgetInit } from "..";

export const WidgetConstructor = <$$ extends Constructor | null, Props, Store>
(init: (props: Props) => WidgetInit) => {
    let stores = new WeakMap<Proto, Store>();
    return class extends Proto {
        declare static props: Props;
        declare static store: Store;
        static override [symbol_ProtoType] = 'Widget';
        static stores = stores;
        
        constructor(...args: Props extends unknown ? [] : [Props, WidgetChildrenLayout<$$>]) {
            super(() => {
                let props = args[0] ?? {};
                let children = args[1];
                let {store, layout, ancestors} = init(props as Props);
                if (!store) store = {};
                if (ancestors) forEach(ancestors, ancestor => {
                    let ancestorProto = this.findAbove(proto => proto.constructor === ancestor);
                    if (ancestorProto) {
                        let ancestorStore = ancestor.stores.get(ancestorProto);
                        _Object_assign(store, ancestorStore);
                    }
                });
                stores.set(this, store);
                //@ts-ignore
                layout({store, children: (proto) => children?.(proto)});
            });
        }
    }
}

export interface Widget<$$ extends Constructor | null = any, Props = any, Store = any> {
    new(...args: Props extends unknown ? [] : [Props]): Proto;
    props: Props;
    store: Store;
    stores: WeakMap<Proto, Store>
    layout: ($$: $$) => void
}