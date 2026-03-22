import { Signal } from "#structure/Signal";
import { isObject, isArray, _Object_entries, _Object_defineProperty } from "@amateras/utils";

export let objectSignal = (signal: Signal, context: Map<any, Signal> = new Map()) => {
    if (signal.value && isObject(signal.value) && !isArray(signal.value)) {
        context.set(signal.value, signal);
        for (let [key, value] of _Object_entries(signal.value)) {
            if (`${key}$` in signal) {
                //@ts-ignore
                objectSignal(signal[`${key}$`], context);
            } else {
                const cachedSignal = context.get(value);
                let memberSignal = cachedSignal ?? new Signal(value);
                memberSignal.subscribe((value) => signal.value[key] = value)
                _Object_defineProperty(signal, `${key}$`, { value: memberSignal, configurable: false, writable: false, enumerable: true });
                if (!cachedSignal) objectSignal(memberSignal, context);
            }
        }
    }
    return signal
}