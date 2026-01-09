import './global';
import { Case } from "#structure/Case"
import { Match } from "#structure/Match"
import { Proto } from '@amateras/core/structure/Proto';
import { _instanceof, is } from '@amateras/utils';

globalThis.Match = Match;
globalThis.Case = Case;

$.process.craft.add((value, arg1, arg2) => {
    if (import.meta.hot) {
        if (value === Match && _instanceof(Proto.proto, Match)) throw 'Match builder only includes Case';
        if (value === Case && !_instanceof(Proto.proto, Match)) throw 'Case must be inside Match builder';
    }
    if (value === Match) {
        let proto = new Match(arg1, arg2);
        proto.parent = Proto.proto;
        return proto
    }
    if (value === Case) {
        return is(Proto.proto, Match)?.case(arg1, arg2)
    }
})