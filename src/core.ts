import './global';
import { Signal } from "#structure/Signal";
import { $Element } from "#node/$Element";
import { $Node, type $NodeContentTypes } from '#node/$Node';
import '#node/node';
import { _instanceof, isString, isFunction, _Object_assign, isObject, isNull, _Object_entries, _Object_defineProperty } from '#lib/native';

const tagNameMap: {[key: string]: Constructor<$Node>} = {}
export function $<K extends (...args: any[]) => $Node>(fn: K, ...args: Parameters<K>): ReturnType<K>;
export function $<K extends $NodeContentTypes | undefined | void, F extends () => K, P extends Parameters<F>>(fn: F, ...args: any[]): K;
export function $<K extends $Node, T extends Constructor<K>, P extends ConstructorParameters<T>>(construct: T, ...args: P): K;
export function $<K extends TemplateStringsArray>(string: K, ...values: any[]): $NodeContentTypes[];
export function $<K extends $Node>($node: K): K;
export function $<K extends Element>(element: K): $Element<K>;
export function $<K extends keyof HTMLElementTagNameMap>(tagname: K): $Element<HTMLElementTagNameMap[K]>
export function $(tagname: string): $Element<HTMLElement>
export function $(resolver: string | Element | $Node | Function | TemplateStringsArray, ...args: any[]) {
    if (_instanceof(resolver, $Node)) return resolver;
    if (isString(resolver) && tagNameMap[resolver]) return new tagNameMap[resolver]();
    if (isFunction(resolver)) 
        if (resolver.prototype?.constructor) return resolver.prototype.constructor(...args); 
        else return resolver(...args);
    if (resolver instanceof Array) {
        const iterate = args.values();
        return resolver.map(str => [str ?? undefined, iterate.next().value]).flat().filter(item => item);
    }
    if (_instanceof(resolver, Node) && _instanceof(resolver.$, $Node)) return resolver.$;
    return new $Element(resolver);
}

export namespace $ {
    type SignalProcess<T> = T extends Array<any> ? {} : T extends object ? { [key in keyof T as `${string & key}$`]: SignalFunction<T[key]> } : {};
    export type SignalFunction<T> = {signal: Signal<T>, set: (newValue: T | ((oldValue: T) => T)) => SignalFunction<T>} & (() => T) & SignalProcess<T>;
    export function signal<T>(value: T): SignalFunction<T>
    export function signal<T>(value: T) {
        const signal = new Signal<T>(value);
        const signalFn = function () { return signal.value(); }
        _Object_assign(signalFn, {
            signal,
            set(newValue: T) { return signal.value(newValue), signalFn; }
        })
        if (isObject(value) && !isNull(value)) {
            for (const [key, val] of _Object_entries(value)) {
                const val$ = $.signal(val);
                val$.signal.subscribe(newValue => { value[key as keyof typeof value] = newValue; signal.emit() });
                _Object_defineProperty(signalFn, `${key}$`, {value: val$});
            }
        }
        return signalFn as unknown as SignalFunction<T>
    }

    export type ComputeFunction<T> = ({(): T}) & { signal: Signal<T> };
    export function compute<T>(process: () => T) {
        let subscribed = false;
        const signalFn: SignalFunction<any> = $.signal(null);
        function computeFn() {
            if (!subscribed) return signalFn.set(subscribe())();
            else return signalFn.set(process())();
        }
        function subscribe () {
            const signalHandler = (signal: Signal<any>) => { 
                signal.subscribe(() => signalFn.set(process())) 
            }
            Signal.listeners.add(signalHandler);
            const result = process();
            Signal.listeners.delete(signalHandler);
            subscribed = true;
            return result;
        }
        _Object_defineProperty(computeFn, 'signal', { value: signalFn.signal });
        return computeFn as ComputeFunction<T>
    }

    export function registerTagName(tagname: string, $node: Constructor<$Node>) {
        tagNameMap[tagname] = $node;
        return $;
    }

    export function orArrayResolver<T>(item: OrArray<T>): T[] {
        return _instanceof(item, Array) ? item : [item];
    }

    export function span(content: string) {
        return $('span').content(content);
    }
}
export type $ = typeof $;
globalThis.$ = $;