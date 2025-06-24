import { _instanceof } from "amateras/lib/native";
import { $CSSMediaRule } from "#structure/$CSSMediaRule";

export abstract class $CSSRule {
    rules = new Set<$CSSRule>();
    ownerRule: $CSSRule | null = null;
    constructor() {}

    abstract get css(): string;
    
    get mediaRules() {
        const rules: $CSSMediaRule[] = []
        this.rules.forEach(rule => {
            if (_instanceof(rule, $CSSMediaRule)) rules.push(rule);
            rules.push(...rule.mediaRules)
        })
        return rules;
    }

    addRule(rule: $CSSRule) {
        this.rules.add(rule);
        rule.ownerRule = this;
        return this;
    }
}