import { _null, _Object_assign, _Object_entries, forEach, isFunction, isNull, isObject, isUndefined } from "@amateras/utils";
import { ontrack, trackSet } from "#lib/track";
import { Proto, symbol_Signal } from "@amateras/core";

export interface Signal<T> {
    (): T;
}
export class Signal<T = any> extends Function {
    [symbol_Signal]: true = true;
    private linked: Signal | null = _null;
    private _value: T
    private subs: null | ((value: T) => void)[] = _null;
    private props: string[] | null;
    private converts: Record<string, (value: any) => Signal> | null;
    exec: null | Function = _null;
    computes: Set<WeakRef<Signal>> | null = _null;
    constructor(value: T, props: string[] | null = _null, convert: Record<string, (value: any) => Signal> | null = _null) {
        super()
        Proto.proto?.global.signals.add(this);
        this._value = value;
        this.props = props;
        this.converts = convert;
        this.assignProperties();
        return new Proxy(this, {
            apply: () => this._exec()
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
        this.props = _null;
    }

    set(resolver: T | ((oldValue: T) => T),) {
        if (isFunction(resolver)) this.set(resolver(this.value));
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
        this.linked = target$;
        this.props = target$.props;
        this.converts = target$.converts;
        this.assignProperties(target$);
        this.emit();
        target$.subscribe(() => this.emit());
    }

    is<T extends Signal>(validator: (signal: this) => boolean): this is T {
        return validator(this)
    }

    private assignProperties(target$?: Signal) {
        if (!isObject(this.value) || isNull(this.value)) return;
        forEach(this.props, propName => {
            //@ts-ignore
            let prop$ = target$?.[`${propName}$`] ?? $.signal(this.value[propName]);
            _Object_assign(this, { [`${propName}$`]: prop$ })
            this.subscribe(v => {
                //@ts-ignore
                prop$.set(v[propName])
            })
        })

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