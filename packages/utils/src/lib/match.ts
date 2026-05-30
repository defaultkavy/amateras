interface MatchCase<T, Rec extends T = never, Res = never, Def = never> {
    case<C extends Exclude<T, Rec>, V>(condition: C, callback: () => V): MatchCase<T, Rec | C, Res | V, Def>
    default<V>(callback: () => V): MatchCase<T, Rec, Res, V>
}

export const match = <T, M extends MatchCase<T>>(condition: T, callback: ($$: MatchCase<T>) => M): 
    M extends MatchCase<T, infer Rec, infer Res, infer Def> 
    ?   Exclude<T, Rec> extends never 
        ?   Res 
        :   Def extends never 
            ?   Res | undefined 
            :   Res | Def
    :   never => {
    var cases = new Map();
    var symbol_default = Symbol('default');
    var match = {
        case: (condition: any, callback: () => any) => {
            cases.set(condition, callback);
            return match;
        },
        default: (callback: () => any) => {
            cases.set(symbol_default, callback);
            return match;
        }
    }
    callback(match as any);
    return cases.get(condition)?.() ?? cases.get(symbol_default)?.();
}