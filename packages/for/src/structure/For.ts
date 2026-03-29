import { symbol_Statement } from "@amateras/core";
import { Proto } from "@amateras/core";
import { ProxyProto } from "@amateras/core";
import type { Signal } from "@amateras/signal";
import { _Array_from, _null, forEach } from "@amateras/utils";

export type ForLayout<T> = (item: T, index: number) => void;
export type ForList<T extends object = object> = Signal<T[]> | Signal<Set<T>>

export class For<T extends object = object> extends ProxyProto {
    static override [symbol_Statement] = true;
    #layout: ForLayout<T>;
    list$: ForList<T>;
    #itemProtoMap = new WeakMap<T, ForItem>();
    constructor(list: ForList<T>, layout: ForLayout<T>) {
        super();
        this.list$ = list;
        this.#layout = layout;

        let update = () => {
            const deleted = this.exec();
            forEach(this.protos, proto => proto.builded || proto.build())
            forEach(deleted, proto => proto.removeNode())
            // if (!this.inDOM()) return;
            let thisNode = this.node;
            let parentNode = thisNode?.parentNode;
            if (thisNode && parentNode) {
                let nodes = this.toDOM();
                let arr = _Array_from(parentNode.childNodes);
                let currentPosition = arr.indexOf(thisNode);
                forEach(nodes, node => {
                    if (node !== thisNode) {
                        let currentNode = parentNode.childNodes[currentPosition];
                        if (currentNode !== node) {
                            let nextNode = parentNode.childNodes[currentPosition + 1] ?? _null;
                            parentNode.insertBefore(node, nextNode)
                        }
                    }
                    currentPosition++;
                })
            }
            this.parent?.mutate()
        }

        this.list$.subscribe(update);
        this.ondispose(() => this.list$.unsubscribe(update));
    }

    override build() {
        this.#itemProtoMap = new WeakMap();
        this.exec();
        this.protos.forEach(proto => proto.builded || proto.build())
        return this;
    }

    private exec() {
        let deleted = this.protos;
        let added = new Set<ForItem>();
        forEach(this.list$.value, (item, i) => {
            $.context(Proto, this, () => {
                let itemProto = this.#itemProtoMap.get(item) ?? new ForItem(() => this.#layout(item, i));
                this.#itemProtoMap.set(item, itemProto);
                deleted.delete(itemProto);
                added.add(itemProto);
            })
        })
        this.replaceProtos(...added);
        return deleted;
    }

    override removeNode(): void {
        this.node?.remove();
        forEach(this.protos, proto => proto.removeNode())
    }
}

export class ForItem extends Proto {
    static override [symbol_Statement] = true
}