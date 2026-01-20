import { symbol_Statement } from "@amateras/core/lib/symbols";
import { Proto } from "@amateras/core/structure/Proto";

export type DefaultLayout = () => void;

export class Default extends Proto {
    static override [symbol_Statement] = true;
    constructor(layout: DefaultLayout) {
        super(layout);
    }
}