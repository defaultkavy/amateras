import type { $State } from "#structure/$State";

export type UntrackFunction = (fn: () => unknown) => ReturnType<typeof fn>

export let ontrack = false;
export let trackSet = new Set<$State>();
export let untrack: UntrackFunction = fn => {
    ontrack = false;
    let result = fn();
    ontrack = true
    return result;
}
export let track = (callback: (untrack: UntrackFunction) => any) => {
    ontrack = true;
    let result = callback(untrack);
    ontrack = false;
    return result;
}