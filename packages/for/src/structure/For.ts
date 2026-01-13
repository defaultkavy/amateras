import { onclient } from "@amateras/core/env";
import { Proto } from "@amateras/core/structure/Proto";
import { ProxyProto } from "@amateras/core/structure/ProxyProto";
import type { Signal } from "@amateras/signal/structure/Signal";
import { forEach } from "@amateras/utils";

export type ForLayout<T> = (item: T, index: number) => void;
export type ForList<T extends object = object> = Signal<T[]> | Signal<Set<T>>

export class For<T extends object = object> extends ProxyProto {
    declare layout: ForLayout<T>;
    list$: ForList<T>;
    #itemProtoMap = new WeakMap<T, ForItem>();
    declare protos: Set<ForItem>;
    constructor(list: ForList<T>, layout: ForLayout<T>) {
        super(layout);
        this.list$ = list;

        let update = () => {
            let {n: newItemList, d: deleteItemList} = this.run();
            forEach(newItemList, proto => proto.build());
            forEach(deleteItemList, proto => proto.removeNode());
            let nodes = onclient() ? this.toDOM() : [];
            let prevNode: Node | undefined
            forEach(nodes, node => {
                if (node.parentNode) prevNode = node;
                else prevNode = prevNode?.parentNode?.insertBefore(node, prevNode.nextSibling)
            })
        }

        this.list$.subscribe(update);
        this.disposers.add(() => this.list$.unsubscribe(update));
    }

    build() {
        this.#itemProtoMap = new WeakMap();
        this.run();
        forEach(this.protos, itemProto => itemProto.build());
        return this;
    }

    run() {
        let newItemList: ForItem[] = [];
        let oldItemList = new Set(this.protos);
        this.clear();
        forEach(this.list$.value, (item, i) => {
            let itemProto = this.#itemProtoMap.get(item);
            if (!itemProto) {
                itemProto = new ForItem();
                newItemList.push(itemProto);
                this.#itemProtoMap.set(item, itemProto);
                itemProto.layout = () => this.layout(item, i);
            }
            else if (oldItemList.has(itemProto)) oldItemList.delete(itemProto);
            itemProto.parent = this;
        })
        return { n: newItemList, d: oldItemList }
    }

    removeNode(): void {
        this.node?.remove();
        forEach(this.protos, proto => proto.removeNode())
    }
}

export class ForItem extends Proto {}