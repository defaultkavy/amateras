import { symbol_Statement } from "@amateras/core";
import { Proto } from "@amateras/core";
import { ProxyProto } from "@amateras/core";
import type { SignalTypes } from "@amateras/signal";
import { _Array_from, _null, forEach } from "@amateras/utils";

export type ForLayout<T extends any[] = [any]> = (item: T['length'] extends 1 ? T[0] : T, index: number) => void;
export type ForIterable = SignalTypes<any[]> | SignalTypes<Set<any>> | SignalTypes<Map<any, any>>

export class For<T extends [K: any, V: any] = [any, any]> extends ProxyProto {
    static override [symbol_Statement] = true;
    #layout: ForLayout<T>;
    list$: ForIterable;
    #itemProtoMap = new Map<T[0], ForItem>();
    constructor(list: ForIterable, layout: ForLayout<T>) {
        super();
        this.list$ = list;
        this.#layout = layout;

        let update = () => {
            const deleted = this.exec();
            forEach(this.protos, proto => proto.builded || proto.build())
            forEach(deleted, proto => proto.removeNode())
            let thisNode = this.node;
            let parentNode = thisNode?.parentNode;
            if (thisNode && parentNode) {
                let nodes = this.toDOM();
                let arr = _Array_from(parentNode.childNodes);
                let currentPosition = arr.indexOf(thisNode);
                let nextNode: Node | null = _null;
                forEach(nodes, node => {
                    if (node !== thisNode) {
                        let currentNode = parentNode.childNodes[currentPosition];
                        if (currentNode !== node) {
                            if (!nodes.includes(currentNode as any)) nextNode = currentNode ?? _null;
                            else nextNode = parentNode.childNodes[currentPosition + 1] ?? _null;
                            parentNode.insertBefore(node, nextNode);
                        }
                    }
                    currentPosition++;
                })
            }
            this.parent?.mutate()
            this.parent?.dispatch('mutate', [], {bubbles: true});
        }

        this.list$.subscribe(update);
        this.listen('dispose', () => this.list$.unsubscribe(update));
    }

    override build() {
        this.#itemProtoMap = new Map();
        this.exec();
        this.protos.forEach(proto => proto.builded || proto.build())
        return this;
    }

    private exec() {
        let deleted = new Set(this.protos);
        let added = new Set<ForItem>();
        forEach(_Array_from(this.list$.value), (item, i) => {
            $.context(Proto, this, () => {
                let layout = this.#layout;
                let itemProto = this.#itemProtoMap.get(item) ?? new ForItem(() => layout(item as any, i));
                this.#itemProtoMap.set(item, itemProto);
                deleted.delete(itemProto);
                added.add(itemProto);
            })
        })
        this.replaceProtos(...added);
        return deleted;
    }

    override dispose(): void {
        super.dispose();
        forEach(this.#itemProtoMap.values(), $item => $item.dispose())
        this.#itemProtoMap.clear();
    }

    override mutate(): void {
        super.mutate();
        this.parent?.mutate();
    }
}

export class ForItem extends Proto {
    static override [symbol_Statement] = true;
}