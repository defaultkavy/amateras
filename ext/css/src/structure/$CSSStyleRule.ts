import type { $CSSDeclaration } from "#structure/$CSSDeclaration";
import { $CSSRule } from "#structure/$CSSRule";
import { _Array_from, _instanceof } from "amateras/lib/native";

export class $CSSStyleRule extends $CSSRule {
    context: string[] = [];
    declarations = new Map<string, $CSSDeclaration>();
    className: string = '';
    constructor(context: string[] = []) {
        super();
        this.context = context;
    }

    get css(): string {
        return `${this.selector} { ${_Array_from(this.declarations).map(([_, dec]) => `${dec}`).join(' ')} }`
    }

    get selector() {
        const ctx: string[][] = [];
        this.context.forEach((part, i) => ctx.push(part.split(',').map(sel => ctx[i - 1] ? ctx[i - 1]!.map(prefix => `${prefix} ${sel.trim()}`) : [sel.trim()]).flat()))
        return ctx.at(-1)?.join(', ')
    }
}