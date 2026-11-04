import { type $CSSRule } from "./$CSSRule";

export abstract class $CSS {
    setRule(key: string, rule: $CSSRule) {
        rule.declarations.set(key, `${this}`)
    }
}