import { track, trackSet, untrack, type UntrackFunction } from "#lib/track";
import { $State } from "#structure/$State";
import { $TextNode } from "@amateras/core/node/$Text";
import { _instanceof, _JSON_stringify, _Object_assign, forEach, _null, _Object_defineProperty, _Object_entries, _Promise } from "@amateras/utils";


declare module '@amateras/core' {
    export namespace $ {
        export function state<T>(value: T): $State<T>;
        export function effect(callback: (untrack: UntrackFunction) => void): void;
        export function compute<T>(callback: (untrack: UntrackFunction) => T): $State<T>;

        export interface TextProcessorValueMap {
            state: $State<any>;
        }
    }
}

_Object_assign($, {
    state(value: any) {
        return new $State(value);
    },

    effect(
        callback: (
            untrack: UntrackFunction
        ) => void
    ) {
        track(callback);
        forEach(trackSet, state => state.signal.subscribe(_ => callback(untrack)));
        trackSet.clear();
    },
    
    compute<T>(
        callback: (
            untrack: UntrackFunction
        ) => T
    ) {
        let result = track(callback);
        let compute = new $State(result);
        forEach(trackSet, state => state.signal.subscribe(_ => compute.set(callback(untrack))));
        trackSet.clear();
        return compute
    }
})

$.processor.text.add(state => {
    if (_instanceof(state, $State)) {
        return new $TextNode(`${state()}`).ondom(node => {
            state.signal.subscribe((value) => node.textContent = `${value}`);
        })
    }
})

$.processor.attr.add((key, value, $node) => {
    if (_instanceof(value, $State)) {
        $node.ondom(element => {
            element.setAttribute(key, `${value.get()}`)
            value.signal.subscribe(val => {
                element.setAttribute(key, `${val}`)
            })
        })
        $node.attr.set(key, `${value.get()}`);
        return true;
    }
})

