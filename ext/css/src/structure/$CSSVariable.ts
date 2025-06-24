export class $CSSVariable {
    key: string;
    value: string;
    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }

    toString() {
        return `var(--${this.key})`
    }
}