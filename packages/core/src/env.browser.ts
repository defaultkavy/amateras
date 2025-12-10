// window and document
export const _window = window;
export const _document = document;

interface onclient {
    (): boolean;
    (fn: Function): void
}

interface onserver {
    (): boolean;
    (fn: Function): void
}

export const onclient: onclient = (fn?: Function) => { 
    if (fn) return fn();
    return true
}
export const onserver: onserver = (fn?: Function) => {
    return false;
}