import { symbol_Statement } from "@amateras/core";
import { Proto } from "@amateras/core";

export type DefaultLayout = () => void;

export class Default extends Proto {
    static override [symbol_Statement] = true;
    declare statementType: 'Default';
    constructor(layout: DefaultLayout) {
        super(layout);
    }
}