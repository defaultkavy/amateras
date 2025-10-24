import './global';
import './node';
import { $Element } from "#node/$Element";
import { $Node, type $NodeContentResolver, type $NodeContentTypes } from '#node/$Node';
import { _instanceof, isString, isFunction, _Object_assign, isObject, isNull, _Object_entries, _Object_defineProperty, forEach, isNumber, _Array_from, isUndefined, _bind, _null } from '#lib/native';
import { $HTMLElement } from '#node/$HTMLElement';
import { _document } from '#lib/env';
import { $EventTarget, type $Event } from '#node/$EventTarget';

const nodeNameMap: {[key: string]: Constructor<$EventTarget>} = {}
const _stylesheet = new CSSStyleSheet();

type $NodeBuilder = (...args: any[]) => $NodeContentResolver<$Node>
type BuilderResultResolver<F> = F extends Constructor<$Node> ? InstanceType<F> : F extends $NodeBuilder ? ReturnType<F> : never;
type BuilderParameterResolver<F> = F extends Constructor<$Node> ? ConstructorParameters<F> : F extends $NodeBuilder ? Parameters<F> : never;

type $Type<T extends EventTarget> = T extends HTMLElement ? $HTMLElement : T extends Element ? $Element : T extends (Node | ChildNode) ? $Node : T extends EventTarget ? $EventTarget : never;

/** Builder function */
export function $<F extends $NodeBuilder | Constructor<$Node> | number, T extends $NodeBuilder | Constructor<$Node>>(
    resolver: F, 
    ...args: F extends number ? [T, ...BuilderParameterResolver<T>] : BuilderParameterResolver<F>
): F extends number 
    ?   number extends F 
        ?   BuilderResultResolver<T> 
        :   Repeat<BuilderResultResolver<T>, F>
    :   BuilderResultResolver<F>;
/** Get {@link $Node} from {@link NodeList} */
export function $<T extends HTMLElement | Element | Node | ChildNode>(nodes: NodeListOf<T>): $Type<T>[];
/** Get self */
export function $<E extends $EventTarget | null | undefined>($node: E, ...args: any[]): E extends $EventTarget ? E : null;
/** Convert {@link Window} to {@link $EventTarget} */
export function $<W extends Window>(node: W): $EventTarget<WindowEventMap>;
/** Convert {@link Document} to {@link $Node} */
export function $<D extends Document>(node: D): $Node<DocumentEventMap>;
/** Convert {@link EventTarget} base to {@link $EventTarget} base*/
export function $<H extends EventTarget | null | undefined>(element: H, ...args: any[]): H extends EventTarget ? $Type<H> : null;
/** Convert string and variables to {@link $NodeContentTypes} array */
export function $<K extends TemplateStringsArray>(string: K, ...values: any[]): $NodeContentTypes[];
/** Get {@link Event.currentTarget} in {@link $EventTarget} type from {@link Event} */
export function $<Ev extends $Event<$Element, Event>>(event: Ev): Ev['currentTarget']['$'];
/** Create {@link $Node} base object from extensions */
export function $<K extends keyof $.$NodeMap, T extends $.$NodeMap[K]>(tagname: K, ...args: ConstructorParameters<T>): InstanceType<T>;
/** Create {@link $HTMLElement} by tagname */
export function $<K extends keyof HTMLElementTagNameMap>(tagname: K): $HTMLElement<HTMLElementTagNameMap[K]>;
/** Create {@link $HTMLElement} by custom tagname */
export function $(tagname: string): $HTMLElement<HTMLElement>
/** Create multiple {@link $HTMLElement} objects by tagname */
export function $<N extends number, K extends keyof HTMLElementTagNameMap>(number: N, tagname: K): number extends N ? $HTMLElement<HTMLElementTagNameMap[K]>[] : Repeat<$HTMLElement<HTMLElementTagNameMap[K]>, N>;
/** Create multiple {@link $HTMLElement} objects by custom tagname */
export function $<N extends number>(number: N, tagname: string): number extends N ? $HTMLElement<HTMLElement>[] : Repeat<$HTMLElement<HTMLElement>, N>;
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
    export interface $NodeMap {}
    // node content amp
    export interface $NodeContentMap {}
    export type $NodeContentTypeExtends = $NodeContentMap[keyof $NodeContentMap]
    // attr value map
    export interface $NodeParameterMap<T> {}
    export type $NodeParameterExtends<T> = $NodeParameterMap<T>[keyof $NodeParameterMap<T>]

    export const assign = (...resolver: [nodeName: string, $node: Constructor<$EventTarget>][]) => {
        forEach(resolver, ([nodeName, $node]) => nodeNameMap[nodeName] = $node);
        return $;
    }

    export const span = (content: string) => $('span').content(content);
}

export type $ = typeof $;
globalThis.$ = $;