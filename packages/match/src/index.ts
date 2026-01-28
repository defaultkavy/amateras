import { Case } from "#structure/Case";
import { Default } from "#structure/Default";
import { Match } from "#structure/Match";
import { Proto } from '@amateras/core';
import { _instanceof, is, isEqual } from '@amateras/utils';
import './global';

globalThis.Match = Match;
globalThis.Case = Case;
globalThis.Default = Default;

$.process.craft.add((value, arg1, arg2) => {
    if (import.meta.hot) {
        if (_instanceof(Proto.proto, Match)) {
            if (!isEqual(value, [Case, Default])) throw 'Match layout only includes Case and Default';
        }
        else {
            if (value === Case) throw 'Case must be inside Match layout';
            if (value === Default) throw 'Default must be inside Match layout';
        }
    }
    if (value === Match) {
        let proto = new Match(arg1, arg2);
        proto.parent = Proto.proto;
        return proto
    }
    if (value === Case) {
        return is(Proto.proto, Match)?.case(arg1, arg2)
    }
    if (value === Default) {
        return is(Proto.proto, Match)?.default(arg1)
    }
})