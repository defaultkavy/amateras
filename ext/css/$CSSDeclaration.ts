export class $CSSDeclaration {
    key: string;
    value: string;
    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }

    get property() {
        return this.key.replaceAll(/([A-Z])/g, (_, s1) => `-${s1}`).toLowerCase();
    }
}