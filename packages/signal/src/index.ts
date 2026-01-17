import { track, trackSet, untrack, type UntrackFunction } from "#lib/track";
import { Signal } from "#structure/Signal";
import { Proto } from "@amateras/core/structure/Proto";
import { TextProto } from "@amateras/core/structure/TextProto";
import { _instanceof, _Object_assign, equal, forEach, isBoolean } from "@amateras/utils";

declare global {
    export function $<T>(signal: Signal<T>): Signal<T>;

    export namespace $ {
        export function signal<T>(value: T): Signal<T>;
        export function effect(callback: (untrack: UntrackFunction) => void): void;
        export function compute<T>(callback: (untrack: UntrackFunction) => T): Signal<T>;
    }
}

_Object_assign($, {
    signal(value: any) {
        return new Signal(value);
    },

    effect(
        callback: (
            untrack: UntrackFunction
        ) => void
    ) {
        track(callback);
        forEach(trackSet, signal => signal.subscribe(_ => callback(untrack)));
        trackSet.clear();
    },
    
    compute<T>(
        callback: (
            untrack: UntrackFunction
        ) => T
    ) {
        let result = track(callback);
        let compute = new Signal(result);
        forEach(trackSet, signal => signal.subscribe(_ => compute.set(callback(untrack))));
        trackSet.clear();
        return compute
    }
})

let toTextProto = (signal: Signal) => {
    if (_instanceof(signal, Signal)) {
        let proto = new TextProto(`${signal}`);
        proto.ondom(node => {
            let fn = (value: any) => node.textContent = `${value}`;
            signal.subscribe(fn);
            proto.disposers.add(() => signal.unsubscribe(fn));
        })

        let fn = (value: any) => proto.content = `${value}`;
        signal.subscribe(fn);
        fn(signal.value);

        proto.parent = Proto.proto;
        return proto;
    }
}

let setAttr = (name: string, node: HTMLElement, signal: Signal) => {
    //@ts-ignore
    if (name in node) node[name] = signal.value;
    else node.setAttribute(name, `${signal}`)
}

$.process.text.add(toTextProto)
$.process.craft.add(toTextProto)
$.process.attr.add((name, signal, proto) => {
    if (_instanceof(signal, Signal)) {
        if (proto.name === 'input') {
            if (equal(name, 'value', 'checked')) {
                proto.on('input', e => signal.set((e.currentTarget as HTMLInputElement)[name]));
                let value = signal.value;
                if (isBoolean(value)) value && proto.attr.set(name, '');
                else proto.attr.set(name, `${value}`)
            }
        } 
        else
            proto.ondom(node => {
                let setNodeAttr = () => setAttr(name, node, signal);
                signal.subscribe(setNodeAttr);
                setNodeAttr();
                proto.disposers.add(() => signal.unsubscribe(setNodeAttr))
            })

            let setProtoAttr = () => {
                
            }
        
        return true;
    }
})

export * from "#structure/Signal";
