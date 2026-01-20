import { _instanceof, _null, _Object_entries, isNumber, isString, map } from "@amateras/utils";
import { $CSS } from "./$CSS";

export class $CSSRule extends $CSS {
    declarations = new Map<string, string>();
    rules = new Map<string, $CSSRule>();
    selector: string;
    parent: $CSSRule | null = _null;
    
    readonly css: $.CSSMap;
    constructor(selector: string, cssMap: $.CSSMap, parent: $CSSRule | null) {
        super();
        this.selector = selector;
        this.parent = parent;
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
        else {
            // 兼容较旧浏览器不支持无 & 前缀的子规则
            let selector = 
                rule.selector.startsWith('@') // 针对 at-rule, 一般 rule 无需判断直接添加 & 前缀给子规则
                && !rule.parent // 如果是 root rule 就不会有 parent 
                ?   key 
                :   `${/^[@]|&/.test(key) ? key : `& ${key}`}`;
            rule.rules.set(selector, new $CSSRule(selector, value as $.CSSMap, rule));
        }
    }
}