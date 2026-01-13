import { Proto } from "@amateras/core/structure/Proto";
import { isArray } from "@amateras/utils";

export type CaseLayout = () => void;

export class Case extends Proto {
    condition: any[]
    constructor(condition: any, layout: CaseLayout) {
        super(layout);
        this.condition = isArray(condition) ? condition : [condition];
    }
}