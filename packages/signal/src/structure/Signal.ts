import { forEach, isFunction, isUndefined } from "@amateras/utils";
import { ontrack, trackSet } from "#lib/track";

let signalValueMap = new WeakMap<Signal, {value: any, subs: Set<(value: any) => void>}>();
let get = (signal: Signal) => signalValueMap.get(signal)!;

export interface Signal<T> {
    (): T;
}
export class Signal<T = any> {
    key: this;
    constructor(value: T) {
        const $state = () => {
            if (ontrack) trackSet.add(this);
            return get($state as this).value;
        }
        Object.setPrototypeOf($state, this);
        signalValueMap.set($state as this, {value, subs: new Set()})
        this.key = $state as this;
        return $state as this
    }
    
    get value(): T {
        return get(this.key).value;
    }

    get subs(): Set<(value: T) => void> {
        return get(this.key).subs;
    }

    set(resolver: T | ((oldValue: T) => T)) {
        if (isFunction(resolver)) this.set(resolver(this.value));
        else if (this.value !== resolver) {
            get(this).value = resolver;
            this.emit();
        }
    }

    modify(callback: (value: T) => void) {
        callback(this.value);
        this.emit();
    }
    
    emit() {
        forEach(get(this).subs, subs => subs(this.value));
    }

    subscribe(callback: (value: T) => void) {
        this.subs.add(callback);
    }

    unsubscribe(callback: (value: T) => void) {
        this.subs.delete(callback);
    }

    toString(): string {
        return `${this.value}`
    }
}