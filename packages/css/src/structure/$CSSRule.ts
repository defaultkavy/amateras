import { Utils } from '@amateras/utils';
import { $CSS } from "./$CSS";

export class $CSSRule extends $CSS {
    declarations = new Map<string, string>();
    rules = new Map<string, $CSSRule>();
    selector: string;
    parent: $CSSRule | null = Utils.Null;
    
    readonly css: $.CSSMap;
    constructor(selector: string, cssMap: $.CSSMap, parent: $CSSRule | null) {
        super();
        this.selector = selector;
        this.parent = parent;
        if (cssMap) processCSSMap(this, cssMap);
        this.css = cssMap;
    }

    toString(): string {
        let declarations = Utils.map(this.declarations, ([name, value]) => `${name.replaceAll(/[A-Z]/g, $0 => `-${$0.toLowerCase()}`)}: ${value};`);
        let rules = Utils.map(this.rules, ([_, rule]) => `${rule}`);
        return `${this.selector} { ${[...declarations, ...rules].join(' ')} }`
    }
}

const processCSSMap = (rule: $CSSRule, cssMap: $.CSSMap) => {
    for (let [key, value] of Utils.entries(cssMap)) {
        // not record __selector__ in cssMap
        if (key === '__selector__') continue;
        if (Utils.isString(value) || Utils.isNumber(value) || Utils.isInstanceof(value, $CSS)) rule.declarations.set(key, `${value}`);
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