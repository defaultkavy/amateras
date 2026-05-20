import { Utils } from '@amateras/utils';
import { ontrack, trackSet } from "#lib/track";
import { Proto, symbol_Signal } from "@amateras/core";
import type { SignalTypes } from "..";

export interface Signal<T> {
    (): T;
}

export class Signal<T = any> extends Function {
    [symbol_Signal]: true = true;
    private linked: Signal | null = Utils.Null;
    private _value: T
    private subs: null | ((value: T) => void)[] = Utils.Null;
    private map: null | Record<string, Signal> = Utils.Null;
    exec: null | Function = Utils.Null;
    computes: Set<WeakRef<Signal>> | null = Utils.Null;
    constructor(value: T) {
        super()
        Proto.proto?.global.signals.add(this);
        this._value = value;
        // if value is Signal, use linked signal to prevent modify the original signal value
        if (Utils.isInstanceof(value, Signal)) this.link(value);
        return new Proxy(this, {
            apply: () => this._exec(),
            get: (_, propName) => {
                if (Utils.isSymbol(propName) || (Utils.isString(propName) && !propName.endsWith('$'))) return this[propName as keyof this];
                // remove $ at last position of prop name
                propName = propName.slice(0, -1);
                if (!this.map) this.map = {};
                const cachedSignal = this.map[propName];
                if (cachedSignal) return cachedSignal;
                else {
                    const signal = this.map[propName] ?? new Signal<any>(null);
                    this.map[propName] = signal;
                    // set signal value (before subscribe)
                    this.setPropValue(signal, propName);
                    signal.subscribe(newValue => {
                        // set member value to parent source object
                        if (Utils.isObject(this.value) && !Utils.isNull(this.value)) {
                            // avoid getter only member
                            if (Object.getOwnPropertyDescriptor(this.value, propName)?.writable) this.value[propName as keyof T] = newValue;
                        }
                        // emit parent signal
                        if (!Utils.isNull(this.value)) this.emit();
                    })
                    this.subscribe(() => this.setPropValue(signal, propName));
                    return signal;
                }
            }
        });
    }

    private _exec() {
        if (ontrack) trackSet.add(this);
        return this.value;
    }

    private setPropValue(signal: Signal, propName: string) {
        if (Utils.isObject(this.value) && !Utils.isNull(this.value)) {
            // parent signal value is object, set value from this object member
            const value = this.value[propName as keyof T];
            signal.set(value);
        } else {
            // parent signal value is not object, member signal value change to null quietly
            signal._value = null;
        }
    }
    
    get value(): T {
        if (this.linked) return this.linked.value;
        return this._value;
    }

    dispose() {
        this.subs = Utils.Null;
        this.linked = Utils.Null;
        Utils.forEach(this.computes, signal => signal.deref()?.dispose());
        this.computes = Utils.Null;
        this.exec = Utils.Null;
        this._value = Utils.Null as any;
        if (this.map) Utils.forEach(Utils.entries(this.map), ([_, value]) => value.dispose());
        this.map = Utils.Null;
    }

    set(resolver: T | ((oldValue: T) => T),) {
        // if value is Signal, use linked signal to prevent modify the original signal value
        if (Utils.isInstanceof(resolver, Signal)) this.link(resolver);
        else if (Utils.isFunction(resolver)) this.set(resolver(this.value));
        else if (this.value !== resolver) {
            this._value = resolver;
            this.linked = Utils.Null;
            this.emit();
        }
    }

    modify(callback: (value: T) => void) {
        callback(this.value);
        this.linked?.emit();
        this.emit();
    }
    
    emit() {
        Utils.forEach(this.subs, subs => subs(this.value));
        Utils.forEach(this.computes, ref => {
            let compute = ref.deref();
            if (!compute) this.computes?.delete(ref);
            compute?.exec?.();
        });
    }

    subscribe(callback: (value: T) => void) {
        this.subs = this.subs ?? [];
        this.subs.push(callback);
    }

    unsubscribe(callback: (value: T) => void) {
        let index = this.subs?.indexOf(callback);
        if (!Utils.isUndefined(index) && index !== -1) this.subs?.splice(index, 1);
    }

    link(target$: Signal) {
        if (this === target$) throw 'Signal.link(): cannot link self'
        this.linked = target$;
        this.emit();
        target$.subscribe(() => this.emit());
    }

    is<T>(validator: (signal: this) => boolean): this is SignalTypes<T> {
        return validator(this)
    }

    override toString(): string {
        return `${this.value}`
    }
}