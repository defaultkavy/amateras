import './global';
import { If } from "#structure/If";
import { Proto } from "@amateras/core";
import { _instanceof, _null, isEqual } from "@amateras/utils";
import { Signal } from '@amateras/signal';
import { ElseIf } from '#structure/ElseIf';
import { Else } from '#structure/Else';
import { Condition } from '#structure/Condition';

globalThis.If = If;
globalThis.Else = Else;
globalThis.ElseIf = ElseIf;

/**This map store condition with parent Proto,
 * all related Statement should be under same parent Proto.
 */
let conditionMap = new WeakMap<Proto, Condition>();

// add condition statement craft function
$.process.craft.add((value, arg1, arg2) => {
    let parentProto = Proto.proto;
    let condition = parentProto ? conditionMap.get(parentProto) : _null;
    // when value equal If, mean this is a new start of condition statement
    if (value === If) {
        condition = new Condition();
        if (parentProto) {
            condition.parent = parentProto;
            conditionMap.set(parentProto, condition);
        }
    }

    // if condition is null, mean this is not a condition statement code
    // or Else/ElseIf not in right place
    if (!_instanceof(condition, Condition)) {
        if (isEqual(value, [Else, ElseIf])) throw 'ElseIf/Else must be after If or ElseIf';
        return;
    }

    // handle If/Else/ElseIf constructor
    // add them into condition child statements
    if (isEqual(value, [If, Else, ElseIf])) {
        let args: [Signal | null, () => void] = _instanceof(arg1, Signal) ? [arg1, arg2] : [_null, arg1];
        let statement = new value(...args);
        condition.statements.add(statement);
    }
    else {
        if (parentProto) conditionMap.delete(parentProto);
        return;
    }
    return condition;
})