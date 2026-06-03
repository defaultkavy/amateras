import { symbol_ProtoType, symbol_Statement } from "#lib/symbols";
import { Utils } from '@amateras/utils';
import { GlobalState } from "./GlobalState";

export type ProtoLayout = (...args: any[]) => void;
export interface ProtoConstructor extends Constructor<Proto> {
    [symbol_ProtoType]: 'Proto'
}

export abstract class Proto {
    static proto: Proto | null = Utils.Null; 
    static readonly [symbol_ProtoType] = 'Proto';
    static [symbol_Statement] = false;
    static eventMap = new WeakMap<Proto, { [key: string]: Set<(...args: any[]) => void> }>();
    layout: $.Layout | null;
    readonly parent: Proto | null = Utils.Null;
    global: GlobalState = Proto.proto?.global ?? new GlobalState(this);
    sibling: Proto | null = Utils.Null;
    firstProto: Proto | null = Utils.Null;
    lastProto: Proto | null = Utils.Null;
    builded = false;
    visible = true;
    virtual = false;
    /**
     * @virtual This property is phantom types, declare the return type of {@link Proto.children}
     * @deprecated
     */
    declare __child__: Proto;
    declare __protos__: Proto;
    constructor(layout?: $.Layout) {
        this.layout = layout ?? Utils.Null;
    }

    dispose(cascading = true) {
        this.dispatch('dispose', [this])
        if (cascading) Utils.forEach(this.protos, proto => proto.dispose());
        Proto.eventMap.delete(this);
        this.global = Utils.Null as any;
        this.sibling = Utils.Null;
        this.firstProto = Utils.Null;
        this.lastProto = Utils.Null;
        (this as Mutable<this>).parent = Utils.Null;
        this.layout = Utils.Null;
    }

    get children(): this['__child__'][] {
        return Utils.map(this.protos, proto => {
            //@ts-ignore
            if (proto.constructor[symbol_Statement]) 
                return proto.children
            else return proto
        }).flat()
    }
    
    get visibleChildren(): this['__child__'][] {
        return this.children.filter(proto => proto.visible);
    }

    get protos(): this['__protos__'][] {
        let protos: Proto[] = [];
        let firstChild = this.firstProto;
        if (firstChild) {
            let currentProto: null | Proto = firstChild;
            while (currentProto) {
                protos.push(currentProto);
                currentProto = currentProto.sibling;
            }
        }
        return protos
    }

    append(...protos: Proto[]) {
        Utils.forEach(protos, proto => {
            if (proto.parent !== this) proto.parent?.removeProtos(proto);
            // directly set sibling of last child
            if (this.lastProto) {
                // proto already in the last place
                if (this.lastProto === proto) return;
                // proto is first child, set first child as second proto
                else if (this.firstProto === proto) this.firstProto = proto.sibling;
                proto.sibling = Utils.Null;
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

    replace(child: Proto, ...protos: Proto[]) {
        const protoArr = this.protos;
        protoArr.splice(protoArr.indexOf(child), 1, ...protos)
        this.processProtos(...protoArr);
    }

    insert(proto: Proto, position = -1) {
        if (position === 0) {
            if (this.firstProto) proto.sibling = this.firstProto;
            this.firstProto = proto;
        }
        else {
            let protoArr = this.protos;
            let index = position < 0 ? protoArr.length + position + 1 : position;
            protoArr.splice(index, 0, proto);
            this.processProtos(...protoArr);
        }
        (proto as Mutable<Proto>).parent = this;
        proto.global = this.global;
    }

    remove() {
        this.parent?.removeProtos(this);
    }

    removeProtos(...protos: Proto[]) {
        let protoSet = new Set(this.protos);
        Utils.forEach(protos, proto => {
            (proto as Mutable<Proto>).parent = null;
            proto.sibling = null;
            protoSet.delete(proto);
        })
        this.processProtos(...protoSet);
    }

    private processProtos(...protos: Proto[]) {
        let prevProto: null | Proto = Utils.Null;
        if (protos.length)
            Utils.forEach(protos, (proto, i) => {
                if (i === 0) this.firstProto = proto;
                if (prevProto) prevProto.sibling = proto;
                proto.sibling = Utils.Null;
                prevProto = proto;
                (proto as Mutable<Proto>).parent = this;
            })
        // if no children then reset firstProto
        else this.firstProto = Utils.Null;
        this.lastProto = prevProto;
    }

    build(cascading = true, clear = true): this {
        if (clear) this.clear(true);
        $.context(this, () => this.layout?.(this));
        this.builded = true;
        if (cascading) Utils.forEach(this.protos, proto => {
            proto.build()
        });
        this.dispatch('builded', [this]);
        return this
    }

    toString(): string {
        return Utils.map(this.protos.filter(proto => proto.visible), proto => `${proto}`).join('')
    }

    toDOM(children = true): Node[] {
        let nodes: Node[] = []
        Utils.forEach(this.protos, proto => {
            if (!proto.visible) proto.removeNode();
            else if (children) nodes.push(...proto.toDOM())
        });
        return nodes;
    }

    removeNode() {
        Utils.forEach(this.protos, proto => proto.removeNode());
    }

    clear(dispose = false) {
        let protos = this.protos;
        this.removeProtos(...protos);
        if (dispose) Utils.forEach(protos, proto => proto.dispose())
    }

    findAbove<T extends Proto>(filter: (proto: Proto) => any): T | null {
        let parent = this.parent;
        if (parent) return filter(parent) ? parent as T : parent.findAbove(filter);
        return Utils.Null;
    }

    findBelow<T extends Proto>(filter: (proto: Proto) => boolean | void): T | null {
        for (let proto of this.protos) {
            if (filter(proto)) return proto as T;
            let nested = proto.findBelow<T>(filter);
            if (nested) return nested;
        }
        return Utils.Null;
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

    get listeners() {
        return Proto.eventMap.get(this);
    }
    
    dispatch<K extends keyof $.ProtoEventMap<this>>(type: K, args: $.ProtoEventMap<this>[K], options?: {bubbles?: boolean}): boolean
    dispatch(type: string, args: any[], options?: {bubbles?: boolean}): boolean
    dispatch(type: string, args: any[], options?: {bubbles?: boolean}): boolean {
        let handlerSet = this.listeners?.[type];
        let preventDefault = false;
        if (options?.bubbles) {
            let prevent = this.parent?.dispatch(type, args, options);
            if (!preventDefault) preventDefault = prevent ?? false;
        }
        Utils.forEach(handlerSet, handle => {
            let prevent = handle(...args) ?? false;
            if (!preventDefault) preventDefault = prevent;
        });
        return preventDefault;
    }

    listen<K extends keyof $.ProtoEventMap<this>>(type: K, handle: (...args: $.ProtoEventMap<this>[K]) => void): void;
    listen(type: string, handle: (src: Proto) => void): void;
    listen(type: string, handle: (...args: any) => void) {
        let listeners = this.listeners ?? {};
        Proto.eventMap.set(this, listeners);
        let handleSet = listeners[type] ?? new Set();
        listeners[type] = handleSet;
        handleSet.add(handle)
    }
}