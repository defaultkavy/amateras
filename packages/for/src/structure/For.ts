import { onclient } from "@amateras/core/env";
import { symbol_Statement } from "@amateras/core/lib/symbols";
import { Proto } from "@amateras/core/structure/Proto";
import { ProxyProto } from "@amateras/core/structure/ProxyProto";
import type { Signal } from "@amateras/signal/structure/Signal";
import { forEach } from "@amateras/utils";

export type ForLayout<T> = (item: T, index: number) => void;
export type ForList<T extends object = object> = Signal<T[]> | Signal<Set<T>>

export class For<T extends object = object> extends ProxyProto {
    static override [symbol_Statement] = true;
    #layout: ForLayout<T>;
    list$: ForList<T>;
    #itemProtoMap = new WeakMap<T, ForItem>();
    declare protos: Set<ForItem>;
    constructor(list: ForList<T>, layout: ForLayout<T>) {
        super();
        this.list$ = list;
        this.#layout = layout;

        let update = () => {
            let {n: newItemList, d: deleteItemList} = this.run();
            forEach(newItemList, proto => proto.build());
            // 如果 For node 没有 parentNode，代表 For 并不在 DOM 树中
            // 跳过处理 DOM 的步骤
            if (!this.node?.parentNode) return;
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

    override build() {
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
                itemProto.layout = () => this.#layout(item, i);
            }
            else oldItemList.delete(itemProto);
            itemProto.parent = this;
        })
        return { n: newItemList, d: oldItemList }
    }

    override removeNode(): void {
        this.node?.remove();
        forEach(this.protos, proto => proto.removeNode())
    }
}

export class ForItem extends Proto {
    static override [symbol_Statement] = true
}