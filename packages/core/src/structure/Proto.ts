import { symbol_ProtoType } from "#lib/symbols";
import { _null, forEach, map } from "@amateras/utils";

export type ProtoBuilder = (...args: any[]) => void;

export abstract class Proto {
    static proto: Proto | null = _null; 
    static [symbol_ProtoType] = 'Proto';
    protos = new Set<Proto>();
    disposers = new Set<() => void>();
    builder: ProtoBuilder | null;
    #parent: Proto | null = _null;
    constructor(builder?: ProtoBuilder) {
        this.builder = builder ?? _null;
    }

    set parent(proto: Proto | null) { 
        this.#parent?.protos.delete(this);
        this.#parent = proto;
        proto?.protos.add(this);
    }

    get parent() {
        return this.#parent;
    }

    build(clear = true): this {
        if (clear) this.clear(true);
        $.context(Proto, this, () => this.builder?.());
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

    findAbove(filter: (proto: Proto) => boolean): Proto | null {
        let parent = this.parent;
        if (parent) return filter(parent) ? parent : parent.findAbove(filter);
        return _null;
    }
}