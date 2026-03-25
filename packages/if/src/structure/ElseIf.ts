import type { SignalStore } from "@amateras/signal";
import { ConditionStatement } from "./ConditionStatement";

export type ElseIfLayout<T> = (value: 
    T extends SignalStore<infer K, infer I> 
    ? K extends null | undefined | false
        ? never
            : SignalStore<K, I>
    : never
) => void;
export class ElseIf extends ConditionStatement {
    declare statementType: 'ElseIf'
}