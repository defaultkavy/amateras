import { _instanceof, forEach, isUndefined } from "#lib/native";

export class Signal<T> {
    #value: T;
    subscribers = new Set<(value: T) => void>();
    static listeners = new Set<(signal: Signal<any>) => void>();
    constructor(value: T) {
        this.#value = value;
    }

    value(): T;
    value(newValue: T): this;
    value(callback: (oldValue: T) => T): this;
    value(resolver?: T | ((oldValue: T) => T)) {
        if (!arguments.length) {
            forEach(Signal.listeners, fn => fn(this));
            return this.#value;
        }
        if (_instanceof(resolver, Function)) this.value(resolver(this.#value));
        else if (!isUndefined(resolver)) {
            this.#value = resolver;
            this.emit();
        }
        return this;
    }

    emit() {
        forEach(this.subscribers, subs => subs(this.#value))
        return this;
    }

    subscribe(callback: (value: T) => void) {
        this.subscribers.add(callback);
        return this;
    }

    unsubscribe(callback: (value: T) => void) {
        this.subscribers.delete(callback);
        return this;
    }

}
