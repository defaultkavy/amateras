import type { $CSSDeclaration } from "#structure/$CSSDeclaration";
import { $CSSRule } from "#structure/$CSSRule";
import { _Array_from, _instanceof, _Object_fromEntries } from "@amateras/utils";

export class $CSSStyleRule extends $CSSRule {
    declarations = new Map<string, $CSSDeclaration>();
    constructor(selector: string) {
        super(selector);
    }

    get options(): {[key: string]: any} {
        return {..._Object_fromEntries(_Array_from(this.declarations).map(([_, dec]) => [dec.key, dec])), ...super.options}
    }
}