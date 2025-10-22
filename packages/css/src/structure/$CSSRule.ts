import { _Array_from, _instanceof, _Object_fromEntries } from "amateras/lib/native";

export abstract class $CSSRule {
    rules = new Set<$CSSRule>();
    selector: string;
    constructor(selector: string) {
        this.selector = selector;
    }

    get options(): {[key: string]: any} {
        return _Object_fromEntries(_Array_from(this.rules).map(rule => [rule.selector, rule.options]))
    }
}