import type { Signal } from "@amateras/signal";
import { ConditionStatement } from "./ConditionStatement";

export type IfLayout<T> = (value: Exclude<T, Signal<null>>) => void;
export class If extends ConditionStatement {
    declare statementType: 'If'
}