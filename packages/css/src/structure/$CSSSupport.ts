import { $CSS } from './$CSS';
import { $CSSRule } from './$CSSRule';

export class $CSSSupport extends $CSS {
    value: $.CSSValue;
    fallbackValue: $.CSSValue
    constructor(value: $.CSSValue, fallbackValue: $.CSSValue) {
        super();
        this.value = value;
        this.fallbackValue = fallbackValue;
    }
    
    override setRule(key: string, rule: $CSSRule) {
        super.setRule(key, rule);
        const selector = `@support not (${key}: ${this.value})`;
        rule.rules.set(selector, new $CSSRule(selector, { [key]: this.fallbackValue }, rule))
    }
}