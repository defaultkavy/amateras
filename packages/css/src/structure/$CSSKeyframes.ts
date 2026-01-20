import { $CSS } from "./$CSS";

export class $CSSKeyframes extends $CSS {
    name: string;
    constructor(name: string) {
        super();
        this.name = name;
    }

    toString(): string {
        return `${this.name.replace('@keyframes ', '')}`
    }
}