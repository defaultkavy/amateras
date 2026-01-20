import { symbol_Statement } from "@amateras/core/lib/symbols";
import { Proto } from "@amateras/core/structure/Proto";
import { isArray } from "@amateras/utils";

export type CaseLayout = () => void;

export class Case extends Proto {
    static override [symbol_Statement] = true;
    declare statementType: 'Case';
    condition: any[]
    constructor(condition: any, layout: CaseLayout) {
        super(layout);
        this.condition = isArray(condition) ? condition : [condition];
    }
}