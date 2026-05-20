import { Null } from "./primitive";

export const debounce = (fn: Function, timeout: number) => {
    let timer: ReturnType<typeof setTimeout> | null = Null;
    let rerun = false;
    return () => {
        if (timer) {
            rerun = true;
            return
        }
        timer = setTimeout(() => {
            timer = Null;
            if (rerun) fn();
            rerun = false;
        }, timeout);
        return fn();
    } 
}