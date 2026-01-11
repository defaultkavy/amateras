import './global';
import { isString, isFunction, forEach, _Object_entries, _instanceof, isArray, _null, isUndefined, _Object_fromEntries, map, _Object_assign } from '@amateras/utils';
import { ElementProto } from './structure/ElementProto';
import { TextProto } from './structure/TextProto';
import { Proto } from './structure/Proto';
import { onclient, onserver } from '#env';
import { hmr } from '#lib/hmr';

export function $(template: TemplateStringsArray, ...args: any[]): Proto[];
export function $(proto: Proto): Proto;
export function $(args: any[]): Proto[];
export function $<T extends keyof HTMLElementTagNameMap>(tagname: T, builder?: $.Builder<HTMLElementTagNameMap[T]>): ElementProto;
export function $<T extends string>(tagname: T, builder?: $.Builder<HTMLElement>): ElementProto;
export function $<T extends keyof HTMLElementTagNameMap>(tagname: T, attr: $.Props, builder?: $.Builder<HTMLElementTagNameMap[T]>): ElementProto;
export function $<T extends string>(tagname: T, attr: $.Props, builder?: $.Builder<HTMLElement>): ElementProto;
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
        let args: [any, any] = isFunction(arg2) ? [,arg2] : [arg2, arg3];
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
    /** Builder 是一个 Proto 作用域函数，所有在此函数中运行 $ 函数所创建的 Proto 都会被加入到运行 Builder 的 Proto 中。 */
    export type Builder<H extends HTMLElement = any> = (proto: ElementProto<H>) => void;
    /** Props 是组件函数的参数，集合了该组件的自定义属性，以及组件 Builder 函数和元素属性的传递。 */
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

    export const stylesheet = onclient() ? new CSSStyleSheet() : _null;
    export const style = (css: string) => stylesheet?.insertRule(css);
    
    if (stylesheet) document.adoptedStyleSheets.push(stylesheet)
}

export type $ = typeof $;

globalThis.$ = $;