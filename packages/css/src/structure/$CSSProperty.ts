import { _Object_assign } from "@amateras/utils";

export interface $CSSPropertyOptions {
    name: string;
    syntax: string;
    initialValue: string;
    inherits: boolean;
}

export interface $CSSProperty extends $CSSPropertyOptions {}
export class $CSSProperty {
    constructor(options: $CSSPropertyOptions) {
        _Object_assign(this, options);
    }

    toString() {
        return `var(${this.name})`
    }
}