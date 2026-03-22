import type { SignalResolve } from "@amateras/signal";
import { ConditionStatement } from "./ConditionStatement";

export type IfLayout<T> = (value: SignalResolve<Exclude<T, undefined | null | false>>) => void;
export class If extends ConditionStatement {
    declare statementType: 'If'
}