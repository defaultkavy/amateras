import { _document } from "../../../../src/lib/env";

const documentElementStyle = _document.documentElement.style;

export class $CSSVariable<V = string> {
    key: string;
    value: V;
    constructor(key: string, value: V) {
        this.key = key;
        this.value = value;
    }

    set(value: string) {
        documentElementStyle.setProperty(`--${this.key}`, value);
        return this;
    }

    reset() {
        documentElementStyle.removeProperty(`--${this.key}`);
        return this;
    }

    toString() {
        return `var(--${this.key})`
    }
}