import { Proto } from "@amateras/core";
import { isUndefined } from "@amateras/utils";

export type StoreInit<T> = () => T;
export type StoreValue<S extends Store> = S extends Store<infer T> ? T : never;

export class Store<T = any> {
    init: StoreInit<T>;
    map = new WeakMap<Proto, T>();
    constructor(init: StoreInit<T>) {
        this.init = init;
    }

    create(): T {
        const root = Proto.proto;
        if (!root) throw `Store.create(): ${ERROR_MESSAGE}`;
        const value = this.init();
        this.map.set(root, value);
        root.ondispose(() => this.map.delete(root));
        return value;
    }

    get() {
        const proto = Proto.proto;
        if (!proto) throw `Store.get(): ${ERROR_MESSAGE}`;
        const value = this.getValueFromProto(proto);
        if (isUndefined(value)) throw 'Store.get(): value not found';
        return value;
    }

    private getValueFromProto(proto: Proto | null): T | undefined {
        if (!proto) return;
        const value = this.map.get(proto);
        return value ?? this.getValueFromProto(proto.parent);
    }
}

const ERROR_MESSAGE = 'should be called inside proto layout function';