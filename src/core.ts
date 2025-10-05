import './global';
import './node';
import { Signal } from "#structure/Signal";
import { $Element } from "#node/$Element";
import { $Node, type $NodeContentResolver, type $NodeContentTypes } from '#node/$Node';
import { _instanceof, isString, isFunction, _Object_assign, isObject, isNull, _Object_entries, _Object_defineProperty, forEach, isNumber, _Array_from, isUndefined, _bind, _null } from '#lib/native';
import { $HTMLElement } from '#node/$HTMLElement';
import { _document } from '#lib/env';
import { $EventTarget, type $Event } from '#node/$EventTarget';

const nodeNameMap: {[key: string]: Constructor<$EventTarget>} = {}
const _stylesheet = new CSSStyleSheet();

export function $<K extends keyof $.NodeMap, T extends $.NodeMap[K]>(tagname: K, ...args: ConstructorParameters<T>): InstanceType<T>;
export function $<K extends keyof HTMLElementTagNameMap>(tagname: K): $HTMLElement<HTMLElementTagNameMap[K]>;
export function $(tagname: string): $HTMLElement<HTMLElement>
export function $<F extends (...args: any[]) => $NodeContentResolver<$Node>>(fn: F, ...args: Parameters<F>): ReturnType<F>;
export function $<T extends Constructor<$Node>, P extends ConstructorParameters<T>, N extends number>(number: N, construct: T, ...args: P): Repeat<InstanceType<T>, N>;
export function $<T extends Constructor<$Node>, P extends ConstructorParameters<T>>(construct: T, ...args: P): InstanceType<T>;
export function $(nodes: NodeListOf<HTMLElement>): $HTMLElement[];
export function $(nodes: NodeListOf<Element>): $Element[];
export function $(nodes: NodeListOf<Node | ChildNode>): $Node[];
export function $<N extends $Node>($node: N, ...args: any[]): N;
export function $<N extends $Node>($node: N | null | undefined, ...args: any[]): N | null | undefined;
export function $<H extends HTMLElement>(element: H, ...args: any[]): $HTMLElement<H>;
export function $<H extends HTMLElement>(element: H | null | undefined, ...args: any[]): $HTMLElement<H> | null | undefined;
export function $<E extends Element>(element: E, ...args: any[]): $Element<E>;
export function $<E extends Element>(element: E | null | undefined, ...args: any[]): $Element<E> | null | undefined;
export function $<D extends Document>(node: D): $Node<DocumentEventMap>;
export function $<N extends Node>(node: N, ...args: any[]): $Node;
export function $<N extends Node>(node: N | null | undefined, ...args: any[]): $Node | null | undefined;
export function $<W extends Window>(node: W): $EventTarget<WindowEventMap>;
export function $<E extends EventTarget>(node: E, ...args: any[]): $EventTarget;
export function $<E extends EventTarget>(node: E | null | undefined, ...args: any[]): $EventTarget | null | undefined;
export function $<K extends TemplateStringsArray>(string: K, ...values: any[]): $NodeContentTypes[];
export function $<Ev extends $Event<$Element, Event>>(event: Ev): Ev['currentTarget']['$'];
export function $<N extends number>(number: N, tagname: string): Repeat<$HTMLElement<HTMLElement>, N>;
export function $<N extends number, K extends keyof HTMLElementTagNameMap>(number: N, tagname: K): Repeat<$HTMLElement<HTMLElementTagNameMap[K]>, N>;
export function $<N extends number, F extends (...args: any[]) => $NodeContentResolver<$Node>>(number: N, fn: F, ...args: Parameters<F>): Repeat<ReturnType<F>, N>;
export function $(resolver: string | number | null | undefined | Element | HTMLElement | $Node | Function | TemplateStringsArray | Event | NodeListOf<Node | ChildNode>, ...args: any[]) {
    if (isNull(resolver) || isUndefined(resolver)) return null;
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
    if (_instanceof(resolver, HTMLElement)) return new $HTMLElement(resolver);
    if (_instanceof(resolver, Element)) return new $Element(resolver);
    if (_instanceof(resolver, Node)) return new $Node(resolver as any);
    if (_instanceof(resolver, EventTarget)) return new $EventTarget(resolver as any);
    if (_instanceof(resolver, NodeList)) return _Array_from(resolver).map($);
    return new $HTMLElement(resolver);
}

export namespace $ {
    // css
    export const stylesheet = _stylesheet;
    _document.adoptedStyleSheets.push(_stylesheet);
    export const style = _bind(_stylesheet.insertRule, _stylesheet);
    // node map
    export interface NodeMap {}

    // signal function
    type SignalObject<T> = T extends Array<any> ? {} : T extends object ? { [key in keyof T as `${string & key}$`]: SignalFunction<T[key]> } : {};
    export type SignalFunction<T> = {
        signal: Signal<T>, 
        set: (newValue: T | ((oldValue: T) => T)) => SignalFunction<T>,
        value: () => T;
    } & (() => T) & SignalObject<T>;
    const signalComputeListeners = new Set<(signal: Signal<any>) => void>();
    const signalEffectListeners = new Set<(signal: Signal<any>) => void>();
    export const signal = <T>(value: T): SignalFunction<T> => {
        const signal = new Signal<T>(value);
        const signalFn = function () { 
            forEach([...signalComputeListeners, ...signalEffectListeners], fn => fn(signal));
            return signal.value();
        } as SignalFunction<T> 
        nestedComputeFn(value, signalFn);
        _Object_assign(signalFn, {
            signal,
            set: (newValue: T) => (signal.value(newValue), signalFn),
            value: () => signal.value()
        })
        return signalFn
    }
    // experiment feature
    const signalFnMap = new Map<any, SignalFunction<any> | ComputeFunction<any>>();
    const nestedComputeFn = (value: any, parentSignalFn: SignalFunction<any> | ComputeFunction<any>) => {
        if (isObject(value) && !isNull(value)) {
            forEach(_Object_entries(value), ([key, val]) => {
                const cachedFn = signalFnMap.get(val);
                const val$ = cachedFn ?? compute(() => parentSignalFn()[key]);
                if (!cachedFn && isObject(val)) {
                    signalFnMap.set(val, val$);
                    nestedComputeFn(val, val$)
                }
                _Object_defineProperty(parentSignalFn, `${key}$`, {value: val$});
            })
        }
    }

    // compute function
    export type ComputeFunction<T> = ({(): T}) & { signal: Signal<T> };
    export const compute = <T>(process: () => T): ComputeFunction<T> => {
        let subscribed = false;
        const signalFn: SignalFunction<any> = signal(_null);
        const computeFn = () => {
            if (!subscribed) return signalFn.set(subscribe()).value();
            else return signalFn.set(process()).value();
        }
        const subscribe = () => {
            const signalHandler = (signal: Signal<any>) => 
                signal.subscribe(() => signalFn.set(process())) 
            signalComputeListeners.add(signalHandler);
            const result = process();
            signalComputeListeners.delete(signalHandler);
            subscribed = true;
            return result;
        }
        _Object_assign(computeFn, { signal: signalFn.signal });
        return computeFn as ComputeFunction<T>
    }

    // effect
    export const effect = (process: () => void) => {
        const signalHandler = (signal: Signal<any>) => 
            signal.subscribe(process);
        signalEffectListeners.add(signalHandler);
        process();
        signalEffectListeners.delete(signalHandler);
    }

    export const assign = (...resolver: [nodeName: string, $node: Constructor<$EventTarget>][]) => {
        forEach(resolver, ([nodeName, $node]) => nodeNameMap[nodeName] = $node);
        return $;
    }

    export const span = (content: string) => $('span').content(content);
}

export type $ = typeof $;
globalThis.$ = $;