import * as _Case from "#structure/Case";
import * as _Match from "#structure/Match";

declare global {
    export var Match: typeof _Match.Match
    export var Case: typeof _Case.Case

    export function $<T>(Match: typeof _Match.Match<T>, layout: _Match.MatchLayout<T>): _Match.Match<T>
    export function $(Case: typeof _Case.Case, condition: any, layout: _Case.CaseLayout): _Case.Case;
}