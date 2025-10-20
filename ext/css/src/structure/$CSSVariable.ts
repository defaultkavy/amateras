import { _document } from "../../../../src/lib/env";

const documentElementStyle = _document.documentElement.style;

export class $CSSVariable<V = string> {
    name: string;
    value: V;
    constructor(key: string, value: V) {
        this.name = key;
        this.value = value;
    }

    set(value: string) {
        documentElementStyle.setProperty(`${this.name}`, value);
        return this;
    }

    reset() {
        documentElementStyle.removeProperty(`${this.name}`);
        return this;
    }

    default(value: string) {
        return `var(${this.name}, ${value})`
    }

    toString() {
        return `var(${this.name})`
    }
}