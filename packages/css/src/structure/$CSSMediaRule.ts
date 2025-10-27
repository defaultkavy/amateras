import { _Array_from, _instanceof } from "@amateras/utils";
import { $CSSRule } from "#structure/$CSSRule";

export class $CSSMediaRule extends $CSSRule {
    condition: string;
    constructor(selector: string) {
        super(selector);
        this.condition = selector.replace('@media ', '');
    }
}