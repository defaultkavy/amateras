import { _document } from "@amateras/core/env";
import { $CSS } from "./$CSS";

const documentElementStyle = _document.documentElement.style;

export class $CSSVariable<V = string> extends $CSS {
    name: string;
    value: V;
    constructor(key: string, value: V) {
        super();
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

    toString(): string {
        return `var(${this.name})`
    }
}