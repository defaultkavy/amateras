import { isFunction } from "@amateras/utils";
import { Signal } from "./Signal";
import { ontrack, trackSet } from "#lib/track";

export interface $State<T> {
    (): T;
}
export class $State<T> {
    signal: Signal<T>
    constructor(value: T) {
        this.signal = new Signal(value);
        const $state = () => {
            if (ontrack) trackSet.add(this);
            return this.get();
        }
        Object.setPrototypeOf($state, this);
        return $state as $State<T>
    }

    set(value: T | ((value: T) => T)) {
        this.signal.value(isFunction(value) ? value(this.get()) : value);
    }

    get() {
        return this.signal.value();
    }
}