import { symbol_ProtoType, symbol_Statement } from "#lib/symbols";
import { _Array_from, _null, forEach, map } from "@amateras/utils";
import { GlobalState } from "./GlobalState";

export type ProtoLayout = (...args: any[]) => void;

export abstract class Proto {
    static proto: Proto | null = _null; 
    static [symbol_ProtoType] = 'Proto';
    static [symbol_Statement] = false;
    static disposer: ((proto: Proto) => void)[] = []
    private disposers: Function[] | null = _null;
    layout: $.Layout | null;
    readonly parent: Proto | null = _null;
    global: GlobalState = Proto.proto?.global ?? new GlobalState(this);
    sibling: Proto | null = _null;
    firstProto: Proto | null = _null;
    lastProto: Proto | null = _null;
    builded = false;
    listeners: { [key: string]: Set<(src: Proto) => void> } | null = _null;
    /**
     * @virtual This property is phantom types, declare the return type of {@link Proto.children}
     * @deprecated
     */
    declare __child__: Proto;
    constructor(layout?: $.Layout) {
        this.layout = layout ?? _null;
    }

    dispose() {
        forEach(Proto.disposer, disposer => disposer(this));
        forEach(this.disposers, disposer => disposer());
        forEach(this.protos, proto => proto.dispose());
        this.sibling = _null;
        this.firstProto = _null;
        this.lastProto = _null;
        this.disposers = _null;
        (this as Mutable<this>).parent = _null;
        this.layout = _null;
    }

    get children(): this['__child__'][] {
        return map(this.protos, proto => {
            //@ts-ignore
            if (proto.constructor[symbol_Statement]) 
                return proto.children
            else return proto
        }).flat()
    }

    get protos(): Set<Proto> {
        let protos = new Set<Proto>();
        let firstChild = this.firstProto;
        if (firstChild) {
            let currentProto: null | Proto = firstChild;
            while (currentProto) {
                protos.add(currentProto);
                currentProto = currentProto.sibling;
            }
        }
        return protos
    }

    append(...protos: Proto[]) {
        forEach(protos, proto => {
            if (proto.parent !== this) proto.parent?.removeProtos(proto);
            // directly set sibling of last child
            if (this.lastProto) {
                // proto already in the last place
                if (this.lastProto === proto) return;
                // proto is first child, set first child as second proto
                else if (this.firstProto === proto) this.firstProto = proto.sibling;
                proto.sibling = _null;
                this.lastProto.sibling = proto;
                this.lastProto = proto;
            } 
            // if no children
            else {
                this.firstProto = proto;
                this.lastProto = proto;
            }
            (proto as Mutable<Proto>).parent = this;
            proto.global = this.global;
        })
    }

    replaceProtos(...protos: Proto[]) {
        this.clear();
        this.processProtos(...protos);
    }

    insert(proto: Proto, position = -1) {
        if (position === 0) {
            if (this.firstProto) proto.sibling = this.firstProto;
            this.firstProto = proto;
        }
        else {
            let protoArr = _Array_from(this.protos);
            let index = position < 0 ? protoArr.length + position + 1 : position;
            protoArr.splice(index, 0, proto);
            this.processProtos(...protoArr);
        }
        (proto as Mutable<Proto>).parent = this;
        proto.global = this.global;
    }

    removeProtos(...protos: Proto[]) {
        let protoSet = this.protos;
        forEach(protos, proto => {
            (proto as Mutable<Proto>).parent = null;
            proto.sibling = null;
            protoSet.delete(proto);
        })
        this.processProtos(...protoSet);
    }

    private processProtos(...protos: Proto[]) {
        let prevProto: null | Proto = null;
        if (protos.length)
            forEach(protos, (proto, i) => {
                if (i === 0) this.firstProto = proto;
                if (prevProto) {
                    prevProto.sibling = proto;
                    if (prevProto.sibling === prevProto) console.debug('process');
                }
                prevProto = proto;
                (proto as Mutable<Proto>).parent = this;
            })
        // if no children then reset firstProto
        else this.firstProto = _null;
        this.lastProto = prevProto;
    }

    build(cascading = true): this {
        this.clear(true);
        $.context(Proto, this, () => this.layout?.(this));
        this.builded = true;
        if (cascading) forEach(this.protos, proto => {
            proto.build()
        });
        this.dispatch('builded', this);
        return this
    }

    toString(): string {
        return map(this.protos, proto => `${proto}`).join('')
    }

    toDOM(children = true): Node[] {
        return children ? map(this.protos, proto => proto.toDOM(children)).flat() : [];
    }

    ondispose(disposer: () => void) {
        this.disposers = this.disposers ?? [];
        this.disposers.push(disposer);
    }

    removeNode() {
        forEach(this.protos, proto => proto.removeNode());
    }

    clear(dispose = false) {
        let protos = this.protos;
        this.removeProtos(...protos);
        if (dispose) forEach(protos, proto => proto.dispose())
    }

    findAbove<T extends Proto>(filter: (proto: Proto) => any): T | null {
        let parent = this.parent;
        if (parent) return filter(parent) ? parent as T : parent.findAbove(filter);
        return _null;
    }

    findBelow(filter: (proto: Proto) => boolean | void): Proto | null {
        for (let proto of this.protos) {
            if (filter(proto)) return proto;
            let nested = proto.findBelow(filter);
            if (nested) return nested;
        }
        return _null;
    }

    findBelowAll<T extends Proto = Proto>(filter: (proto: Proto) => boolean | void): T[] {
        let matches: T[] = [];
        for (let proto of this.protos) {
            if (filter(proto)) matches.push(proto as T);
            matches.push(...proto.findBelowAll(filter) as T[]);
        }
        return matches;
    }

    /**
     * This method will be called when control flow proto is updated, 
     * it's useful when you need re-render content of component while content updated.
     */
    mutate() {}

    get text(): string {
        return this.children.map(proto => proto.text).join('')
    }

    dispatch(type: string, src: Proto, options?: {bubbles?: boolean}) {
        if (options?.bubbles) this.parent?.dispatch(type, src, options);
        let handlerSet = this.listeners?.[type];
        forEach(handlerSet, handle => handle(src));
    }

    listen<K extends keyof ProtoEventMap>(type: K, handle: (...args: ProtoEventMap[K]) => void): void;
    listen(type: string, handle: (src: Proto) => void): void;
    listen(type: string, handle: (...args: any) => void) {
        let listeners = this.listeners ?? {};
        this.listeners = listeners;
        let handleSet = listeners[type] ?? new Set();
        this.listeners[type] = handleSet;
        handleSet.add(handle)
    }
}