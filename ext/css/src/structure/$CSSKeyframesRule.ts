import { $CSSRule } from "#structure/$CSSRule";

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
        return `@keyframes ${this.name} { ${Array.from(this.rules).map(rule => rule.css).join(' ')} }`
    }
}