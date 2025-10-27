import { _document } from "@amateras/core/lib/env";

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

    default(value: string | $CSSVariable) {
        return `var(${this.name}, ${value})`
    }

    toString() {
        return `var(${this.name})`
    }
}