import { $CSSStyleRule } from "#structure/$CSSStyleRule";
import { _Array_from } from "../../../../src/lib/native";

export class $CSSKeyframeRule extends $CSSStyleRule {
    keyframe: string
    constructor(keyframe: string) {
        super();
        this.keyframe = keyframe;
    }

    get css(): string {
        return `${this.keyframe} { ${_Array_from(this.declarations).map(([_, dec]) => `${dec}`).join(' ')} }`
    }
}