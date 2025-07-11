import { _instanceof, forEach } from "amateras/lib/native";
import { $CSSMediaRule } from "#structure/$CSSMediaRule";

export abstract class $CSSRule {
    rules = new Set<$CSSRule>();
    constructor() {}

    get mediaRules() {
        const rules: $CSSMediaRule[] = []
        forEach(this.rules, rule => {
            if (_instanceof(rule, $CSSMediaRule)) rules.push(rule);
            rules.push(...rule.mediaRules)
        })
        return rules;
    }

    addRule(rule: $CSSRule) {
        this.rules.add(rule);
        return this;
    }
}