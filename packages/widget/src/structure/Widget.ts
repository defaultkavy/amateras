import { symbol_ProtoType } from "@amateras/core";
import { Proto } from "@amateras/core";
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
        declare context: WidgetContext;
        
        constructor(...args: Props extends unknown ? [] : [Props, WidgetChildrenLayout<$$>]) {
            super(() => {
                let props = args[0] ?? {};
                let children = args[1];
                let {store, layout, ancestors} = init(props as Props);
                if (!store) store = {};
                forEach(ancestors, ancestor => {
                    let ancestorProto = this.findAbove(proto => proto.constructor === ancestor && proto);
                    if (ancestorProto) {
                        let ancestorStore = ancestor.stores.get(ancestorProto);
                        _Object_assign(store, ancestorStore);
                    }
                });

                //@ts-ignore
                this.context = new WidgetContext(this, store, (proto) => children?.(proto));
                stores.set(this, store);
                layout(this.context);
            });
        }

        override dispose(): void {
            super.dispose();
            stores.delete(this);
            this.context._store = null;
        }
    }
}

class WidgetContext {
    $$: Widget;
    _store: any;
    children: (proto?: Proto) => void;
    constructor($$: Widget, store: any, children: (proto?: Proto) => void) {
        this.$$ = $$;
        this._store = store;
        this.children = children;
    }

    get store() {
        //@ts-ignore
        return this.$$.constructor.stores.get(this.$$)!
    }
}

export interface Widget<$$ extends Constructor | null = any, Props = any, Store = any> extends Proto {
    new(...args: Props extends unknown ? [] : [Props]): Proto;
    props: Props;
    store: Store;
    stores: WeakMap<Proto, Store>
    layout: ($$: $$) => void
}