import { _Array_from, _instanceof } from "amateras/lib/native";
import { $CSSRule } from "#structure/$CSSRule";
import { $CSSStyleRule } from "./$CSSStyleRule";

export class $CSSMediaRule extends $CSSRule {
    condition: string;
    constructor(condition: string) {
        super();
        this.condition = condition;
    }

    get css(): string {
        function findOwnerMediaRule(rule: $CSSRule, contextRules: $CSSMediaRule[]) {
            const ownerRule = rule.ownerRule;
            if (!ownerRule) return contextRules;
            if (_instanceof(ownerRule, $CSSMediaRule)) return findOwnerMediaRule(ownerRule, [ownerRule, ...contextRules]);
            else return findOwnerMediaRule(ownerRule, contextRules);
        }
        
        function findChildRules(rule: $CSSRule, rules: $CSSStyleRule[] = []) {
            _Array_from(rule.rules).forEach((_rule => {
                if (!_instanceof(_rule, $CSSStyleRule)) return;
                rules.push(_rule);
                return findChildRules(_rule, rules);
            }))
            return rules
        }
        return `@media ${findOwnerMediaRule(this, [this]).map(rule => rule.condition).join(' and ')} { ${findChildRules(this).map(rule => rule.css).join(' ')} }`
    }
}