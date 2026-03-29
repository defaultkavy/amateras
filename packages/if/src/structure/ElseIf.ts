import type { Signal } from "@amateras/signal";
import { ConditionStatement } from "./ConditionStatement";

export type ElseIfLayout<T> = (value: Exclude<T, Signal<null>>) => void;
export class ElseIf extends ConditionStatement {
    declare statementType: 'ElseIf'
}