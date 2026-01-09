import { Proto } from "@amateras/core/structure/Proto";
import { isArray } from "@amateras/utils";

export type CaseBuilder = () => void;

export class Case extends Proto {
    condition: any[]
    constructor(condition: any, builder: CaseBuilder) {
        super(builder);
        this.condition = isArray(condition) ? condition : [condition];
    }
}