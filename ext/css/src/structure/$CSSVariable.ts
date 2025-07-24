export class $CSSVariable<V = string> {
    key: string;
    value: V;
    constructor(key: string, value: V) {
        this.key = key;
        this.value = value;
    }

    toString() {
        return `var(--${this.key})`
    }
}