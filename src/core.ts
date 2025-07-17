import './global';
import { Signal } from "#structure/Signal";
import { $Element, type $Event } from "#node/$Element";
import { $Node, type $NodeContentResolver, type $NodeContentTypes } from '#node/$Node';
import '#node/node';
import { _instanceof, isString, isFunction, _Object_assign, isObject, isNull, _Object_entries, _Object_defineProperty, forEach, isNumber, _Array_from, _document } from '#lib/native';
import type { $HTMLElement } from '#node/$HTMLElement';

const nodeNameMap: {[key: string]: Constructor<$Node>} = {}

export function $<F extends (...args: any[]) => $NodeContentResolver<$Node>, N extends number>(number: N, fn: F, ...args: Parameters<F>): Repeat<ReturnType<F>, N>;
export function $<F extends (...args: any[]) => $NodeContentResolver<$Node>>(fn: F, ...args: Parameters<F>): ReturnType<F>;
export function $<T extends Constructor<$Node>, P extends ConstructorParameters<T>, N extends number>(number: N, construct: T, ...args: P): Repeat<InstanceType<T>, N>;
export function $<T extends Constructor<$Node>, P extends ConstructorParameters<T>>(construct: T, ...args: P): InstanceType<T>;
export function $<N extends $Node>($node: N, ...args: any[]): N;
export function $<H extends HTMLElement>(element: H, ...args: any[]): $HTMLElement<H>;
export function $<E extends Element>(element: E, ...args: any[]): $Element<E>;
export function $<K extends TemplateStringsArray>(string: K, ...values: any[]): $NodeContentTypes[];
export function $<K extends keyof HTMLElementTagNameMap, N extends number>(number: N, tagname: K): Repeat<$HTMLElement<HTMLElementTagNameMap[K]>, N>;
export function $<K extends keyof HTMLElementTagNameMap>(tagname: K): $HTMLElement<HTMLElementTagNameMap[K]>;
export function $<Ev extends $Event<$Element, Event>>(event: Ev): Ev['target']['$'];
export function $<N extends number>(number: N, tagname: string): Repeat<$HTMLElement<HTMLElement>, N>;
export function $(tagname: string): $HTMLElement<HTMLElement>
export function $(resolver: string | number | Element | $Node | Function | TemplateStringsArray | Event, ...args: any[]) {
    if (_instanceof(resolver, $Node)) return resolver;
    if (isString(resolver) && nodeNameMap[resolver]) return new nodeNameMap[resolver](...args);
    if (isFunction(resolver)) 
        if (resolver.prototype?.constructor) return new resolver.prototype.constructor(...args); 
        else return resolver(...args);
    if (resolver instanceof Array) {
        const iterate = args.values();
        return resolver.map(str => [str ?? undefined, iterate.next().value]).flat().filter(item => item);
    }
    if (_instanceof(resolver, Node) && _instanceof(resolver.$, $Node)) return resolver.$;
    if (_instanceof(resolver, Event)) return $(resolver.currentTarget as Element);
    if (isNumber(resolver)) return _Array_from({length: resolver}).map(_ => $(args[0], ...args.slice(1)));
    return new $Element(resolver);
}

export namespace $ {
    export const stylesheet = new CSSStyleSheet();
    _document.adoptedStyleSheets.push(stylesheet);
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
        const signalFn: SignalFunction<any> = signal(null);
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
        _Object_assign(computeFn, { signal: signalFn.signal });
        return computeFn as ComputeFunction<T>
    }

    export function assign(resolver: [nodeName: string, $node: Constructor<$Node>][]): void;
    export function assign(nodeName: string, $node: Constructor<$Node>): void;
    export function assign(resolver: string | [nodeName: string, $node: Constructor<$Node>][], $node?: Constructor<$Node>) {
        if (isString(resolver)) $node && (nodeNameMap[resolver] = $node);
        else forEach(resolver, ([nodeName, $node]) => nodeNameMap[nodeName] = $node);
        return $;
    }

    export function toArray<T>(item: OrArray<T>): T[] {
        return _instanceof(item, Array) ? item : [item];
    }

    export function span(content: string) {
        return $('span').content(content);
    }
}
export type $ = typeof $;
globalThis.$ = $;