import * as _Match from "#structure/Match";
import * as _Case from "#structure/Case";

declare global {
    export var Match: typeof _Match.Match
    export var Case: typeof _Case.Case

    export function $<T>(Match: typeof _Match.Match<T>, builder: _Match.MatchBuilder<T>): _Match.Match<T>
    export function $(Case: typeof _Case.Case, condition: any, builder: _Case.CaseBuilder): _Case.Case;
}