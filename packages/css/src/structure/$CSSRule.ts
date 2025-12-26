import { map, _Object_entries, isString, _instanceof, isNumber } from "@amateras/utils";
import { $CSS } from "./$CSS";

export class $CSSRule extends $CSS {
    declarations = new Map<string, string>();
    rules = new Map<string, $CSSRule>();
    selector: string;
    readonly css: $.CSSMap;
    constructor(selector: string, cssMap: $.CSSMap) {
        super();
        this.selector = selector;
        if (cssMap) processCSSMap(this, cssMap);
        this.css = cssMap;
    }

    toString(): string {
        let declarations = map(this.declarations, ([name, value]) => `${name.replaceAll(/[A-Z]/g, $0 => `-${$0.toLowerCase()}`)}: ${value};`);
        let rules = map(this.rules, ([_, rule]) => `${rule}`);
        return `${this.selector} { ${[...declarations, ...rules].join(' ')} }`
    }
}

const processCSSMap = (rule: $CSSRule, cssMap: $.CSSMap) => {
    for (let [key, value] of _Object_entries(cssMap)) {
        if (isString(value) || isNumber(value) || _instanceof(value, $CSS)) rule.declarations.set(key, `${value}`);
        else rule.rules.set(key, new $CSSRule(key, value as $.CSSMap));
    }
}