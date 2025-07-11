import { _Array_from, _instanceof } from "amateras/lib/native";
import { $CSSRule } from "#structure/$CSSRule";

export class $CSSMediaRule extends $CSSRule {
    condition: string;
    selector?: string;
    constructor(condition: string, selector?: string) {
        super();
        this.condition = condition;
        this.selector = selector;
    }
}