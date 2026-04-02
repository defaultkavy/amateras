import './global';
import { If } from "#structure/If";
import { Proto } from "@amateras/core";
import { _instanceof, _null, isIncluded } from "@amateras/utils";
import { Signal, type SignalObject, type SignalTypes } from '@amateras/signal';
import { ElseIf } from '#structure/ElseIf';
import { Else } from '#structure/Else';
import { Condition } from '#structure/Condition';

globalThis.If = If;
globalThis.Else = Else;
globalThis.ElseIf = ElseIf;

export type IfLayout<T> = (value: T extends SignalTypes<infer V>
    ?   V extends object
        ?   SignalObject<V> 
        :   V extends null 
            ?   never
            :   Signal<V>
    : never) => void;

/**This map store condition with parent Proto,
 * all related Statement should be under same parent Proto.
 */
let condition: Condition | null = null;
// add condition statement craft function
$.process.craft.add((value, arg1, arg2) => {
    let parentProto = Proto.proto;
    // when value equal If, mean this is a new start of condition statement
    if (value === If) {
        condition = new Condition();
        parentProto?.append(condition);
    }

    // if condition is null, mean this is not a condition statement code
    // or Else/ElseIf not in right place
    if (!_instanceof(condition, Condition)) {
        if (isIncluded(value, [Else, ElseIf])) throw 'ElseIf/Else must be after If or ElseIf';
        return;
    }

    // handle If/Else/ElseIf constructor
    // add them into condition child statements
    if (isIncluded(value, [If, Else, ElseIf])) {
        let args: [Signal | null, () => void] = _instanceof(arg1, Signal) ? [arg1, arg2] : [_null, arg1];
        let statement = new value(...args);
        condition.statements = condition.statements ?? [];
        condition.statements?.push(statement);
    }
    else {
        condition = _null;
        return;
    }
    return condition;
})