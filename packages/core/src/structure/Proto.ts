import { symbol_ProtoType, symbol_Statement } from "#lib/symbols";
import { _Array_from, _null, forEach, map } from "@amateras/utils";
import { GlobalState } from "./GlobalState";

export type ProtoLayout = (...args: any[]) => void;

export abstract class Proto {
    static proto: Proto | null = _null; 
    static [symbol_ProtoType] = 'Proto';
    static [symbol_Statement] = false;
    disposers = new Set<() => void>();
    layout: $.Layout | null;
    readonly parent: Proto | null = _null;
    global: GlobalState = Proto.proto?.global ?? new GlobalState();
    sibling: Proto | null = _null;
    firstProto: Proto | null = _null;
    lastProto: Proto | null = _null;
    /**
     * @virtual This property is phantom types, declare the return type of {@link Proto.children}
     * @deprecated
     */
    declare __child__: Proto;
    constructor(layout?: $.Layout) {
        this.layout = layout ?? _null;
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
            while (!!currentProto) {
                protos.add(currentProto);
                currentProto = currentProto.sibling;
            }
        }
        return protos
    }

    appendProto(...protos: Proto[]) {
        forEach(protos, proto => {
            if (proto.parent !== this) proto.parent?.removeProto(proto);
            if (this.lastProto) {
                this.lastProto.sibling = proto;
                this.lastProto = proto;
            } else {
                this.firstProto = proto;
                this.lastProto = proto;
            }
            (proto as Mutable<Proto>).parent = this;
            proto.global = this.global;
        })
    }

    insertProto(proto: Proto, position = -1) {
        if (position === 0) {
            if (this.firstProto) proto.sibling = this.firstProto;
            this.firstProto = proto;
        }
        else {
            let protoArr = _Array_from(this.protos);
            let index = position < 0 ? protoArr.length + position + 1 : position;
            protoArr.splice(index, 0, proto);
            this.processProtos(protoArr);
        }
        (proto as Mutable<Proto>).parent = this;
        proto.global = this.global;
    }

    removeProto(...protos: Proto[]) {
        let protoSet = this.protos;
        forEach(protos, proto => {
            (proto as Mutable<Proto>).parent = null;
            this.sibling = null;
            protoSet.delete(proto);
        })
        this.processProtos(protoSet);
    }

    private processProtos(protos: Set<Proto> | Proto[]) {
        let prevProto: null | Proto = null;
        forEach(protos, (proto, i) => {
            if (i === 0) this.firstProto = proto;
            if (prevProto) prevProto.sibling = proto;
            prevProto = proto;
        })
        this.lastProto = prevProto;
    }

    build(cascading = true): this {
        this.clear(true);
        $.context(Proto, this, () => this.layout?.(this));
        if (cascading) forEach(this.protos, proto => {
            proto.build()
        });
        return this
    }

    toString(): string {
        return map(this.protos, proto => `${proto}`).join('')
    }

    toDOM(children = true): Node[] {
        return children ? map(this.protos, proto => proto.toDOM(children)).flat() : [];
    }

    dispose() {
        forEach(this.disposers, disposer => disposer());
        forEach(this.protos, proto => proto.dispose());
    }

    removeNode() {
        forEach(this.protos, proto => proto.removeNode());
    }

    clear(dispose = false) {
        let protos = this.protos;
        this.removeProto(...protos);
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
}