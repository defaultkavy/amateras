import type { $CSSDeclaration } from "#css/$CSSDeclaration";
import { $CSSRule } from "#css/$CSSRule";

export class $CSSStyleRule extends $CSSRule {
    context: string[] = [];
    declarations = new Map<string, $CSSDeclaration>();
    className: string = '';
    constructor(context: string[] = []) {
        super();
        this.context = context;
    }

    toString() {
        return `${this.selector} { ${[...this.declarations.values()].map(dec => `${dec.property}: ${dec.value};`).join('\n')} }`
    }

    get selector() {
        return this.context.join(' ');
    }
}