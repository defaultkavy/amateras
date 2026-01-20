import { onclient, onserver } from '#env';
import { hmr } from '#lib/hmr';
import { _instanceof, _null, forEach, isArray, isFunction, isString, isUndefined } from '@amateras/utils';
import './global';
import { ElementProto } from './structure/ElementProto';
import { Proto } from './structure/Proto';
import { TextProto } from './structure/TextProto';

type ElementProtoArguments<C extends Constructor> = 
    RequiredKeys<RemoveIndexSignature<ConstructorParameters<C>[0]>> extends never 
    ?   [layout?: ConstructorParameters<C>[1]] | [props: ConstructorParameters<C>[0], layout?: ConstructorParameters<C>[1]] 
    :   [props: ConstructorParameters<C>[0], layout?: ConstructorParameters<C>[1]] 

export function $<T extends ElementProto<any>, C extends Constructor<T>, R extends InstanceType<C>>(constructor: C, ...args: ElementProtoArguments<C>): R;
export function $(template: TemplateStringsArray, ...args: any[]): Proto[];
export function $(proto: Proto): Proto;
export function $(args: any[]): Proto[];
export function $<T extends keyof HTMLElementTagNameMap>(tagname: T, layout?: $.Layout<ElementProto<HTMLElementTagNameMap[T]>>): ElementProto;
export function $<T extends string>(tagname: T, layout?: $.Layout<ElementProto>): ElementProto;
export function $<T extends keyof HTMLElementTagNameMap>(tagname: T, attr: $.Props, layout?: $.Layout<ElementProto<HTMLElementTagNameMap[T]>>): ElementProto;
export function $<T extends string>(tagname: T, attr: $.Props, layout?: $.Layout<ElementProto>): ElementProto;
export function $(...args: any): any {
    const prevProtoParent = Proto.proto;
    let protos: Proto[] = []
    const addProtoToParent = (proto: Proto) => {
        proto.parent = prevProtoParent;
        protos.push(proto);
    }
    for (let process of $.process.craft) {
        let result = process(...args);
        if (!isUndefined(result)) return result;
    }
    const [arg1, arg2, arg3] = args;

    // Proto
    if (_instanceof(arg1, Proto)) {
        addProtoToParent(arg1);
        return arg1;
    }

    // Element Proto
    if (isString(arg1)) {
        let args: [any, any] = isFunction(arg2) ? [,arg2] : [arg2, arg3];
        let eleProto = new ElementProto(arg1, ...args);
        addProtoToParent(eleProto);
        return eleProto;
    }
    
    // Function Handler
    if (isFunction(arg1)) {
        let args: [any, any] = isFunction(arg2) ? [{}, arg2] : [arg2, arg3];
        let target = new arg1(...args);
        // Widget Handler
        if (_instanceof(target, Proto)) {
            addProtoToParent(target);
            return target;
        }
    }

    if (isArray(arg1)) {
        let valueBuilder = (value: any) => {
            for (let process of $.process.text) {
                let proto = process(value);
                if (!isUndefined(proto)) return addProtoToParent(proto);
            }
            let valueTextProto = isUndefined(value) ? _null : new TextProto(`${value}`);
            if (valueTextProto) addProtoToParent(valueTextProto);
        }

        let [arg1, ...values] = args

        // Variables Array Handler
        if (!arg1.raw) {
            forEach(arg1, arg => valueBuilder(arg))
        }
        
        // Template String Array Handler
        else {
            forEach(arg1 as string[], (str, index) => {
                let strTextProto = str.length ? new TextProto(str) : _null;
                let value = values[index];
                if (strTextProto) addProtoToParent(strTextProto);
                valueBuilder(value)
            })
        }
        return protos;
    }
}


export namespace $ {
    /** Layout 是一个 Proto 模板函数，所有在此函数中运行 $ 函数所创建的 Proto 都会被加入到运行 Layout 的 Proto 中。 */
    export type Layout<E extends Proto = any> = (proto: E) => void;
    /** Props 是组件函数的参数，集合了该组件的自定义属性，以及组件 Layout 函数和元素属性的传递。 */
    export type Props<T = {}> = { [key: string]: any } & T;

    export interface AttrMap {}

    export type CraftMiddleware = (...args: any[]) => any;
    export type TextMiddleware = (value: any) => Proto | undefined;
    export type AttrMiddleware = (name: string, value: any, proto: ElementProto) => any;

    export const process = {
        craft: new Set<CraftMiddleware>(),
        text: new Set<TextMiddleware>(),
        attr: new Set<AttrMiddleware>()
    }

    export const dispose = (disposer: () => void) => {
        Proto.proto?.disposers.add(disposer);
    }

    export const render = (proto: Proto, element: HTMLElement | (() => HTMLElement)) => {
        // Disable render on server side
        if (onserver()) return;
        element = isFunction(element) ? element() : element;
        
        if (!hmr(element, proto)) {
            let nodes = proto.build().toDOM()
            element.replaceChildren(...nodes);
        };
    }

    export const context = (proto: {proto: Proto | null}, parent: Proto | null, callback: () => void) => {
        let cacheProtoParent = proto.proto;
        proto.proto = parent;
        callback();
        proto.proto = cacheProtoParent;
    }

    export const call = <T>(callback: () => T) => callback();

    interface MatchCase<T, Rec extends T = never, Res = never, Def = never> {
        case<C extends Exclude<T, Rec>, V>(condition: C, callback: () => V): MatchCase<T, Rec | C, Res | V, Def>
        default<V>(callback: () => V): MatchCase<T, Rec, Res, V>
    }

    export const match = <T, M extends MatchCase<T>>(condition: T, callback: ($$: MatchCase<T>) => M): 
        M extends MatchCase<T, infer Rec, infer Res, infer Def> 
        ?   Exclude<T, Rec> extends never 
            ?   Res 
            :   Def extends never 
                ?   Res | undefined 
                :   Res | Def
        :   never => {
        var cases = new Map();
        var symbol_default = Symbol('default');
        var match = {
            case: (condition: any, callback: () => any) => {
                cases.set(condition, callback);
                return match;
            },
            default: (callback: () => any) => {
                cases.set(symbol_default, callback);
                return match;
            }
        }
        callback(match as any);
        return cases.get(condition)?.() ?? cases.get(symbol_default)?.();
    }
    export const stylesheet = onclient() ? new CSSStyleSheet() : _null;
    export const styleMap = new Map<Constructor<ElementProto>, string>();
    export const style = (proto: Constructor<ElementProto> | null, css: string) => {
        if (proto) styleMap.set(proto, css);
        stylesheet?.insertRule(css);
    }
    
    if (stylesheet) document.adoptedStyleSheets.push(stylesheet);

    if (onclient()) document.querySelector('style#__ssr__')?.remove();
}

export type $ = typeof $;

globalThis.$ = $;

export * from "#structure/ElementProto";
export * from "#structure/GlobalState";
export * from "#structure/NodeProto";
export * from "#structure/Proto";
export * from "#structure/ProxyProto";
export * from "#structure/TextProto";

