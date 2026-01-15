import { symbol_ProtoType } from "#lib/symbols";
import { _null, forEach, map } from "@amateras/utils";
import { GlobalState } from "./GlobalState";

export type ProtoLayout = (...args: any[]) => void;

export abstract class Proto {
    static proto: Proto | null = _null; 
    static [symbol_ProtoType] = 'Proto';
    protos = new Set<Proto>();
    disposers = new Set<() => void>();
    layout: ProtoLayout | null;
    #parent: Proto | null = _null;
    global = new GlobalState(this);
    constructor(layout?: ProtoLayout) {
        this.layout = layout ?? _null;
    }

    set parent(proto: Proto | null) { 
        this.#parent?.protos.delete(this);
        this.#parent = proto;
        if (proto) this.global = proto.global;
        proto?.protos.add(this);
    }

    get parent() {
        return this.#parent;
    }

    get root() {
        return this.findAbove(proto => !proto.parent)
    }

    build(): this {
        this.clear(true);
        $.context(Proto, this, () => this.layout?.());
        forEach(this.protos, proto => {
            proto.build()
        });
        return this
    }

    toString(): string {
        return map(this.protos, proto => `${proto}`).join('')
    }

    toDOM(): Node[] {
        return map(this.protos, proto => proto.toDOM()).flat();
    }

    dispose() {
        forEach(this.disposers, disposer => disposer());
        forEach(this.protos, proto => proto.dispose());
    }

    removeNode() {
        forEach(this.protos, proto => proto.removeNode());
    }

    clear(dispose = false) {
        this.protos.clear();
        if (dispose) forEach(this.protos, proto => proto.dispose())
    }

    findAbove(filter: (proto: Proto) => boolean | void): Proto | null {
        let parent = this.parent;
        if (parent) return filter(parent) ? parent : parent.findAbove(filter);
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
}