import { _null, _Object_assign, forEach, isFunction, isNull, isObject, isUndefined } from "@amateras/utils";
import { ontrack, trackSet } from "#lib/track";

export interface Signal<T> {
    (): T;
}
export class Signal<T = any> extends Function {
    private linked: Signal | null = _null;
    private _value: T
    private subs: null | ((value: T) => void)[] = _null;
    private props: string[] | null;
    exec: null | Function = _null;
    computes: Set<WeakRef<Signal>> | null = _null;
    constructor(value: T, props: string[] | null = _null) {
        super()
        this._value = value;
        this.props = props;
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
        this.assignProperties();
        this.emit();
        target$.subscribe(() => this.emit());
    }

    is<T extends Signal>(validator: (signal: this) => boolean): this is T {
        return validator(this)
    }

    private assignProperties() {
        if (!isObject(this.value) || isNull(this.value)) return;
        forEach(this.props, propName => {
            //@ts-ignore
            let prop$ = $.signal(this.value[propName]);
            _Object_assign(this, { [`${propName as string}$`]: prop$ })
            this.subscribe(v => {
                //@ts-ignore
                prop$.set(v[propName])
            })
        })
    }

    override toString(): string {
        return `${this.value}`
    }
}