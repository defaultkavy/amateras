import type { SignalResolve } from "@amateras/signal";
import { ConditionStatement } from "./ConditionStatement";

export type ElseIfLayout<T> = (value: SignalResolve<Exclude<T, undefined | null | false>>) => void;
export class ElseIf extends ConditionStatement {
    declare statementType: 'ElseIf'
}