import { _null, _Object_assign, _Object_entries, forEach, isFunction, isNull, isObject, isString, isSymbol, isUndefined } from "@amateras/utils";
import { ontrack, trackSet } from "#lib/track";
import { Proto, symbol_Signal } from "@amateras/core";
import type { SignalTypes } from "..";

export interface Signal<T> {
    (): T;
}

export class Signal<T = any> extends Function {
    [symbol_Signal]: true = true;
    private linked: Signal | null = _null;
    private _value: T
    private subs: null | ((value: T) => void)[] = _null;
    private converts: Record<string, (value: any) => Signal> | null;
    private map: null | Record<string, Signal> = _null;
    exec: null | Function = _null;
    computes: Set<WeakRef<Signal>> | null = _null;
    constructor(value: T, convert: Record<string, (value: any) => Signal> | null = _null) {
        super()
        Proto.proto?.global.signals.add(this);
        this._value = value;
        this.converts = convert;
        // this.assignProperties();
        return new Proxy(this, {
            apply: () => this._exec(),
            get: (target, propName) => {
                if (isSymbol(propName) || (isString(propName) && !propName.endsWith('$'))) return this[propName as keyof this];
                const value = this.value[propName.slice(0, -1) as keyof T];
                if (!this.map) this.map = {};
                const signal = this.map[propName] ?? new Signal(value);
                this.map[propName] = signal;
                return signal;
            }
        });
    }

    private _exec() {
        if (ontrack) trackSet.add(this);
        return this.value;
    }
    
    get value(): T {
        if (this.linked) return this.linked.value;
        return this._value;
    }

    dispose() {
        this.subs = _null;
        this.linked = _null;
        forEach(this.computes, signal => signal.deref()?.dispose());
        this.computes = _null;
        this.exec = _null;
        this._value = _null as any;
        if (this.map) forEach(_Object_entries(this.map), ([_, value]) => value.dispose());
        this.map = _null;
    }

    set(resolver: T | ((oldValue: T) => T),) {
        if (this.linked) this.linked.set(resolver);
        else if (isFunction(resolver)) this.set(resolver(this.value));
        else if (this.value !== resolver) {
            this._value = resolver;
            this.emit();
        }
    }

    modify(callback: (value: T) => void) {
        callback(this.value);
        this.emit();
    }
    
    emit() {
        forEach(this.subs, subs => subs(this.value));
        forEach(this.computes, ref => {
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
        if (!isUndefined(index) && index !== -1) this.subs?.splice(index, 1);
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

    private assignProperties(target$?: Signal) {
        if (!isObject(this.value) || isNull(this.value)) return;

        if (this.converts) forEach(_Object_entries(this.converts), ([propName, resolve]) => {
            //@ts-ignore
            let prop$ = target$?.[`${propName}$`] ?? resolve(this.value[propName]);
            _Object_assign(this, { [`${propName}$`]: prop$ });
        })
    }

    override toString(): string {
        return `${this.value}`
    }
}