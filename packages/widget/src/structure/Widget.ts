import { symbol_ProtoType } from "@amateras/core/lib/symbols";
import { Proto } from "@amateras/core/structure/Proto";
import type { WidgetChildrenBuilder, WidgetInit } from "..";
import { isFunction, forEach, _Object_assign } from "@amateras/utils";

export const WidgetConstructor = <$$ extends Proto, Props, Store>
(ancestors: Widget[], stores: any, init: WidgetInit) => 
    class extends Proto {
        declare static props: Props;
        declare static store: Store;
        static [symbol_ProtoType] = 'Widget';
        static stores = stores;
        
        constructor(...args: Props extends unknown ? [] : [Props, WidgetChildrenBuilder<$$>]) {
            super(() => {
                let props = args[0];
                let children = args[1];
                let [arg1, arg2] = init(props);
                let store = isFunction(arg1) ? {} : arg1;
                let builder = isFunction(arg1) ? arg1 : arg2;
                forEach(ancestors, ancestor => {
                    let ancestorProto = this.findAbove(proto => proto.constructor === ancestor);
                    if (ancestorProto) {
                        let ancestorStore = ancestor.stores.get(ancestorProto);
                        _Object_assign(store, ancestorStore);
                    }
                });
                stores.set(this, store);
                builder({store, children: () => children?.(Proto.proto as $$)});
            });
        }
    }

export interface Widget<$$ extends Proto = any, Props = any, Store = any> {
    new(...args: Props extends unknown ? [] : [Props]): Proto;
    props: Props;
    store: Store;
    stores: WeakMap<Proto, Store>
}