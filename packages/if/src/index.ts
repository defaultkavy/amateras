import './global';
import { If } from "#structure/If";
import { _instanceof, _null, isArray, isIncluded } from "@amateras/utils";
import { Signal, type SignalObject } from '@amateras/signal';
import { ElseIf } from '#structure/ElseIf';
import { Else } from '#structure/Else';
import { Condition } from '#structure/Condition';

globalThis.If = If;
globalThis.Else = Else;
globalThis.ElseIf = ElseIf;

export type IfLayout<T> = (...value: T extends any[]
    ?   ResolveArray<T>
    :   [ResolveSignal<T>]
) => void;

type ResolveArray<T> = T extends [infer A, ...infer Rest] 
    ?   [A] extends [Signal<any>]
        ?   [ResolveSignal<A>, ...ResolveArray<Rest>]
        :   []
    :   [];

type ResolveSignal<T> = [T] extends [Signal<infer V>]
    ?   V extends object
        ?   SignalObject<V> 
        :   V extends null
            ?   never
            :   Signal<V>
    :   T;

/**This map store condition with parent Proto,
 * all related Statement should be under same parent Proto.
 */
let condition: Condition | null = null;
// add condition statement craft function
$.process.craft.add((value, arg1, arg2) => {
    // when value equal If, mean this is a new start of condition statement
    if (value === If) {
        condition = new Condition();
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
        let args: [Signal | Signal[] | null, () => void] = (_instanceof(arg1, Signal) || isArray(arg1)) ? [arg1, arg2] : [_null, arg1];
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