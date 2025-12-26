import { _Object_assign } from "@amateras/utils";
import { $CSS } from "./$CSS";

export interface $CSSPropertyOptions {
    name: string;
    syntax: string;
    initialValue?: string;
    inherits?: boolean;
}

export interface $CSSProperty extends $CSSPropertyOptions {}
export class $CSSProperty extends $CSS {
    constructor(options: $CSSPropertyOptions) {
        super();
        _Object_assign(this, options);
    }

    toString() {
        return `var(${this.name})`
    }
}