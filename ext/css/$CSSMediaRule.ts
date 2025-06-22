import { $CSSRule } from "#css/$CSSRule";

export class $CSSMediaRule extends $CSSRule {
    condition: string;
    constructor(condition: string) {
        super();
        this.condition = condition;
    }

    toString() {
        return `@media ${this.condition} { ${[...this.rules.values()].map(rule => rule.toString()).join('\n')} }`
    }
}