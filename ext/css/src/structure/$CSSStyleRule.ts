import type { $CSSDeclaration } from "#structure/$CSSDeclaration";
import { $CSSRule } from "#structure/$CSSRule";
import { _Array_from, _instanceof } from "amateras/lib/native";

export class $CSSStyleRule extends $CSSRule {
    declarations = new Map<string, $CSSDeclaration>();
    selector: string;
    constructor(selector: string) {
        super();
        this.selector = selector;
    }

    get css(): string {
        return `${this.selector} { ${_Array_from(this.declarations).map(([_, dec]) => `${dec}`).join(' ')} }`
    }

    clone(selector: string) {
        const rule = new $CSSStyleRule(selector)
        rule.declarations = this.declarations;
        rule.rules = this.rules;
        return rule
    }
}