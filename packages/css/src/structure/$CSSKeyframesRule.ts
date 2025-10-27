import { $CSSRule } from "#structure/$CSSRule";

export class $CSSKeyframesRule extends $CSSRule {
    name: string;
    constructor(name: string) {
        super(`@keyframes ${name}`);
        this.name = name;
    }
    
    toString(): string {
        return this.name;
    }
}