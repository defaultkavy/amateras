import { _Array_from, _instanceof } from "@amateras/utils";
import { $CSSRule } from "#structure/$CSSRule";

export class $CSSContainerRule extends $CSSRule {
    condition: string;
    name: string;
    constructor(selector: string) {
        super(selector);
        const [_, name, condition] = selector.match(/@container (.+?) (.+)/) as [string, string, string]
        this.name = name;
        this.condition = condition;
    }
}