import { $CSSRule } from "#structure/$CSSRule";
import { _Array_from } from "../../../../src/lib/native";

export class $CSSKeyframesRule extends $CSSRule {
    name: string;
    constructor(name: string) {
        super();
        this.name = name;
    }
    
    toString(): string {
        return this.name;
    }

    get css() {
        return `@keyframes ${this.name} { ${_Array_from(this.rules).map(rule => rule.css).join(' ')} }`
    }
}