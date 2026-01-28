import { _document, onclient } from "@amateras/core";
import { $CSS } from "./$CSS";

export class $CSSVariable<V = string> extends $CSS {
    name: string;
    value: V;
    constructor(key: string, value: V) {
        super();
        this.name = key;
        this.value = value;
    }

    set(value: string) {
        if (onclient()) _document.documentElement.style.setProperty(`${this.name}`, value);
        return this;
    }

    reset() {
        if (onclient()) _document.documentElement.style.removeProperty(`${this.name}`);
        return this;
    }

    default(value: string | $CSSVariable) {
        return `var(${this.name}, ${value})`
    }

    declare(value?: V | $CSSVariable) {
        return {[this.name]: `${value ?? this.value}`}
    }

    toString(): string {
        return `var(${this.name})`
    }
}